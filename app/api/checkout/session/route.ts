import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    const session = (await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "line_items.data.price.product",
        "customer",
        "payment_intent",
      ],
    })) as unknown as Stripe.Checkout.Session;

    let orderNumber: number | null = null;
    const supabase = createAdminClient();
    if (supabase) {
      const { data: orderRow } = await supabase
        .from("orders")
        .select("order_number")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      orderNumber =
        orderRow && typeof orderRow.order_number === "number"
          ? orderRow.order_number
          : null;
    }

    const shippingDetails = (session as any).shipping_details as
      | Stripe.Checkout.Session.CollectedInformation.ShippingDetails
      | null
      | undefined;

    let lineItems = session.line_items?.data ?? [];
    if (lineItems.length === 0) {
      const listed = await stripe.checkout.sessions.listLineItems(sessionId, {
        limit: 100,
        expand: ["data.price.product"],
      });
      lineItems = listed.data;
    }
    const lineItemsPayload = lineItems.map((line) => {
      const product = line.price?.product;
      const name =
        line.description ||
        (typeof product === "string"
          ? null
          : (product as Stripe.Product | undefined)?.name) ||
        "Item";
      return {
        description: name,
        quantity: line.quantity ?? 1,
        amount_total: line.amount_total ?? 0,
        unit_amount: line.price?.unit_amount ?? 0,
        currency: (line.currency || session.currency || "eur").toUpperCase(),
      };
    });

    const sessionData = {
      id: session.id,
      line_items: lineItemsPayload,
      customer_details: {
        email: session.customer_details?.email,
        name: session.customer_details?.name,
      },
      shipping_details: shippingDetails
        ? {
            address: {
              line1: shippingDetails.address?.line1 || "",
              line2: shippingDetails.address?.line2 || null,
              city: shippingDetails.address?.city || "",
              postal_code: shippingDetails.address?.postal_code || "",
              country: shippingDetails.address?.country || "",
            },
            name: shippingDetails.name || "",
          }
        : null,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      metadata: session.metadata || {},
    };

    return NextResponse.json({ session: sessionData, order_number: orderNumber });
  } catch (error: any) {
    console.error("Checkout session retrieve error:", error);
    return NextResponse.json(
      { error: error.message || "Could not load checkout session" },
      { status: 500 }
    );
  }
}

