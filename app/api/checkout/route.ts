import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getBogoFreeQuantity } from "@/lib/promotions";

// Option B: Use Stripe Price IDs created in dashboard
const STRIPE_PRICE_ID_BY_PRODUCT_ID: Record<string, string> = {
  "1": "price_1TPQBbE05eLsiJ8gbZDqVkGW", // 29 EUR (test)
  "2": "price_1TPQBqE05eLsiJ8gaYBKef9y", // 49 EUR (test)
  "3": "price_1TPQC7E05eLsiJ8gdRGzgG9x", // 89 EUR (test)
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, businessInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    const lineItems = items.flatMap((item: any) => {
      const productId = String(item?.product?.id ?? "");
      const stripePriceId = STRIPE_PRICE_ID_BY_PRODUCT_ID[productId];
      if (!stripePriceId) {
        throw new Error(`Missing Stripe price for product id: ${productId}`);
      }

      const promo = item.product?.promotion;

      if (promo?.type === "bogo") {
        const freeQty = getBogoFreeQuantity(item.quantity, promo);
        const paidQty = Math.max(0, item.quantity - freeQty);

        const paidLine =
          paidQty > 0
            ? [
                {
                  price: stripePriceId,
                  quantity: paidQty,
                },
              ]
            : [];

        const freeLine =
          freeQty > 0
            ? [
                {
                  price_data: {
                    currency: "eur",
                    product_data: {
                      description: item.product.description?.slice(0, 500),
                      images: item.product.images || [item.product.image],
                      name: `${item.product.name} (FREE)`,
                    },
                    unit_amount: 0,
                  },
                  quantity: freeQty,
                },
              ]
            : [];

        return [...paidLine, ...freeLine];
      }

      return [
        {
          price: stripePriceId,
          quantity: item.quantity,
        },
      ];
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      locale: "en",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "IE",
          "NZ",
          "FR",
          "DE",
          "BE",
          "CH",
        ],
      },
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata: {
        business_name: businessInfo?.businessName || "",
        business_place_id: businessInfo?.placeId || "",
        business_address: businessInfo?.address || "",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: error.message || "Payment error" },
      { status: 500 }
    );
  }
}
