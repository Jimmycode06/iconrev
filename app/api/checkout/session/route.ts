import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

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
      expand: ["customer", "payment_intent"],
    })) as unknown as Stripe.Checkout.Session;

    const shippingDetails = (session as any).shipping_details as
      | Stripe.Checkout.Session.CollectedInformation.ShippingDetails
      | null
      | undefined;

    const sessionData = {
      id: session.id,
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

    return NextResponse.json({ session: sessionData });
  } catch (error: any) {
    console.error("Checkout session retrieve error:", error);
    return NextResponse.json(
      { error: error.message || "Could not load checkout session" },
      { status: 500 }
    );
  }
}

