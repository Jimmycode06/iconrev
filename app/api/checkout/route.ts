import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getBogoFreeQuantity } from "@/lib/promotions";
import { packImageUrlForProductId } from "@/lib/pack-display-image";

/** Montants serveur (centimes EUR) — doivent correspondre aux prix catalogue. */
const UNIT_AMOUNT_EUR_CENTS: Record<string, number> = {
  "1": 2900,
  "2": 4900,
  "3": 8900,
};

function productImageAbsolute(request: NextRequest, productId: string): string {
  const path = packImageUrlForProductId(productId);
  return new URL(path, request.nextUrl.origin).href;
}

/** Stripe refuse une description vide : on ne l'envoie que si du texte existe. */
function stripeProductData(
  name: string,
  description: unknown,
  images: string[]
): Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData {
  const trimmed = String(description ?? "").trim();
  const base: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData =
    {
      name,
      images,
    };
  if (trimmed.length > 0) {
    base.description = trimmed.slice(0, 500);
  }
  return base;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, businessInfo, locale: localeParam } = body;

    const localeStripe =
      localeParam === "fr" ? "fr" : localeParam === "en" ? "en" : "auto";

    const prefix = localeParam === "fr" ? "/fr" : "";

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const lineItems = items.flatMap((item: any) => {
      const productId = String(item?.product?.id ?? "");
      const unitAmount = UNIT_AMOUNT_EUR_CENTS[productId];
      if (unitAmount === undefined) {
        throw new Error(`Produit inconnu : ${productId}`);
      }

      const promo = item.product?.promotion;
      const imgUrl = productImageAbsolute(request, productId);

      const productName = String(item.product?.name ?? `Pack ${productId}`);

      const paidLineItem = (qty: number) =>
        qty > 0
          ? [
              {
                price_data: {
                  currency: "eur",
                  unit_amount: unitAmount,
                  product_data: stripeProductData(
                    productName,
                    item.product?.description,
                    [imgUrl]
                  ),
                },
                quantity: qty,
              },
            ]
          : [];

      if (promo?.type === "bogo") {
        const freeQty = getBogoFreeQuantity(item.quantity, promo);
        const paidQty = Math.max(0, item.quantity - freeQty);

        const freeLine =
          freeQty > 0
            ? [
                {
                  price_data: {
                    currency: "eur",
                    product_data: stripeProductData(
                      `${item.product.name} (offert)`,
                      item.product.description,
                      [imgUrl]
                    ),
                    unit_amount: 0,
                  },
                  quantity: freeQty,
                },
              ]
            : [];

        return [...paidLineItem(paidQty), ...freeLine];
      }

      return paidLineItem(item.quantity);
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      locale: localeStripe as Stripe.Checkout.SessionCreateParams.Locale,
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
      success_url: `${request.nextUrl.origin}${prefix}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}${prefix}/cart`,
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
      { error: error.message || "Erreur de paiement" },
      { status: 500 }
    );
  }
}
