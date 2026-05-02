import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const isProd = process.env.NODE_ENV === "production";

/**
 * Filtre `raw_checkout_session` pour éviter de stocker des PII inutiles ou
 * sensibles (numéros de carte tokenisés, headers internes Stripe, etc.).
 * On ne garde que ce dont l'admin a besoin pour relire la commande.
 */
function summariseStripeSession(session: Stripe.Checkout.Session) {
  return {
    id: session.id,
    payment_status: session.payment_status,
    amount_total: session.amount_total,
    currency: session.currency,
    metadata: session.metadata ?? null,
    created: session.created,
    payment_method_types: session.payment_method_types ?? null,
    customer_details: session.customer_details
      ? {
          email: session.customer_details.email,
          name: session.customer_details.name,
          phone: session.customer_details.phone,
        }
      : null,
    line_items_count: session.line_items?.data?.length ?? 0,
  };
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case "payment_intent.succeeded":
      // No-op : la persistence se fait sur checkout.session.completed.
      break;

    case "payment_intent.payment_failed": {
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.error("PaymentIntent failed:", failedPayment.id);
      break;
    }

    default:
      if (!isProd) {
        console.log(`Unhandled event type: ${event.type}`);
      }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const supabase = createAdminClient();
  if (!supabase) {
    console.warn(
      "Supabase admin client is not configured. Skipping order persistence."
    );
    return;
  }

  const enrichedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product"],
  });

  const shipping = enrichedSession.collected_information?.shipping_details;
  const amountTotal = enrichedSession.amount_total ?? 0;

  // 1) On lit l'état actuel pour ne pas écraser un order_status > 'paid'
  //    (par ex. 'fulfilled' déjà traité par l'admin).
  const { data: existing } = await supabase
    .from("orders")
    .select("id,order_status")
    .eq("stripe_session_id", enrichedSession.id)
    .maybeSingle();

  const preservedOrderStatus =
    existing?.order_status === "fulfilled" ? "fulfilled" : "paid";

  const orderPayload = {
    stripe_session_id: enrichedSession.id,
    stripe_payment_intent_id:
      typeof enrichedSession.payment_intent === "string"
        ? enrichedSession.payment_intent
        : null,
    customer_email:
      enrichedSession.customer_details?.email || enrichedSession.customer_email,
    amount_total: amountTotal,
    currency: (enrichedSession.currency || "eur").toUpperCase(),
    payment_status: enrichedSession.payment_status,
    order_status: preservedOrderStatus,
    business_name: enrichedSession.metadata?.business_name || null,
    business_place_id: enrichedSession.metadata?.business_place_id || null,
    business_address: enrichedSession.metadata?.business_address || null,
    shipping_name: shipping?.name || null,
    shipping_line1: shipping?.address?.line1 || null,
    shipping_line2: shipping?.address?.line2 || null,
    shipping_city: shipping?.address?.city || null,
    shipping_state: shipping?.address?.state || null,
    shipping_postal_code: shipping?.address?.postal_code || null,
    shipping_country: shipping?.address?.country || null,
    raw_checkout_session: summariseStripeSession(enrichedSession),
  };

  let order: { id: string };
  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update(orderPayload)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (updateError || !updated) {
      console.error("Failed to update order:", updateError);
      return;
    }
    order = updated;
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();
    if (insertError || !inserted) {
      console.error("Failed to persist order:", insertError);
      return;
    }
    order = inserted;
  }

  const lineItems = enrichedSession.line_items?.data ?? [];
  if (lineItems.length === 0) return;

  const orderItemsPayload = lineItems.map((lineItem) => {
    const product = lineItem.price?.product;
    return {
      order_id: order.id,
      stripe_line_item_id: lineItem.id,
      stripe_price_id:
        typeof lineItem.price?.id === "string" ? lineItem.price.id : null,
      stripe_product_id:
        typeof product === "string"
          ? product
          : (product as Stripe.Product | undefined)?.id || null,
      product_name:
        lineItem.description ||
        (typeof product === "string"
          ? null
          : (product as Stripe.Product | undefined)?.name) ||
        "Card pack",
      quantity: lineItem.quantity || 1,
      unit_amount: lineItem.price?.unit_amount ?? 0,
      amount_subtotal: lineItem.amount_subtotal ?? 0,
      amount_total: lineItem.amount_total ?? 0,
      currency: (lineItem.currency || enrichedSession.currency || "eur").toUpperCase(),
    };
  });

  await supabase.from("order_items").delete().eq("order_id", order.id);
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    console.error("Failed to persist order items:", itemsError);
  }
}
