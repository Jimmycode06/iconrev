import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getBogoFreeQuantity } from "@/lib/promotions";

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
      const promo = item.product?.promotion;

      if (promo?.type === "bogo") {
        const freeQty = getBogoFreeQuantity(item.quantity, promo);
        const paidQty = Math.max(0, item.quantity - freeQty);
        const base = {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: item.product.description?.slice(0, 500),
            images: item.product.images || [item.product.image],
          },
          unit_amount: Math.round(item.product.price * 100),
        };

        const paidLine =
          paidQty > 0
            ? [
                {
                  price_data: base,
                  quantity: paidQty,
                },
              ]
            : [];

        const freeLine =
          freeQty > 0
            ? [
                {
                  price_data: {
                    ...base,
                    product_data: {
                      ...base.product_data,
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
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.name,
              description: item.product.description?.slice(0, 500),
              images: item.product.images || [item.product.image],
            },
            unit_amount: Math.round(item.product.price * 100),
          },
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
