import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { assertSameOrigin, enforceRateLimit } from "@/lib/api-security";

function getSupabaseAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

function getSupabaseUser() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function POST(request: Request) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const limitBlock = enforceRateLimit(request, {
    scope: "cards-activate",
    limit: 10,
    windowMs: 60_000,
  });
  if (limitBlock) return limitBlock;

  try {
    const body = await request.json();
    const {
      cardId,
      activationToken,
      googlePlaceId,
      businessName,
      businessAddress,
    } = body;

    if (!cardId || !googlePlaceId || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields: cardId, googlePlaceId, businessName" },
        { status: 400 }
      );
    }

    if (typeof cardId !== "string" || cardId.length > 64) {
      return NextResponse.json(
        { error: "Invalid card identifier." },
        { status: 400 }
      );
    }
    if (typeof googlePlaceId !== "string" || googlePlaceId.length > 128) {
      return NextResponse.json(
        { error: "Invalid Google Place ID." },
        { status: 400 }
      );
    }
    if (typeof businessName !== "string" || businessName.length > 200) {
      return NextResponse.json(
        { error: "Invalid business name." },
        { status: 400 }
      );
    }
    if (
      businessAddress != null &&
      (typeof businessAddress !== "string" || businessAddress.length > 500)
    ) {
      return NextResponse.json(
        { error: "Invalid business address." },
        { status: 400 }
      );
    }
    if (
      activationToken != null &&
      (typeof activationToken !== "string" || activationToken.length > 128)
    ) {
      return NextResponse.json(
        { error: "Invalid activation token." },
        { status: 400 }
      );
    }

    const supabaseUser = getSupabaseUser();
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to activate a card." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: card, error: fetchError } = await supabase
      .from("cards")
      .select("id, review_url, owner_id, activation_token")
      .eq("id", cardId)
      .single();

    if (fetchError || !card) {
      return NextResponse.json(
        { error: "Card not found. Please check your card ID." },
        { status: 404 }
      );
    }

    if (card.review_url) {
      return NextResponse.json(
        { error: "This card has already been activated." },
        { status: 409 }
      );
    }

    // Si la carte a un activation_token (cartes émises après la migration),
    // l'appelant doit le fournir. Pour les cartes legacy (token NULL), on
    // accepte sans token pour ne pas casser les plaques déjà imprimées.
    if (card.activation_token && card.activation_token !== activationToken) {
      return NextResponse.json(
        { error: "Invalid activation link. Please scan the QR code on your plate again." },
        { status: 403 }
      );
    }

    const reviewUrl = `https://search.google.com/local/writereview?placeid=${googlePlaceId}`;

    const { error: updateError } = await supabase
      .from("cards")
      .update({
        google_place_id: googlePlaceId,
        review_url: reviewUrl,
        business_name: businessName,
        business_address: businessAddress || null,
        owner_email: user.email,
        owner_id: user.id,
        activated_at: new Date().toISOString(),
      })
      .eq("id", cardId)
      .is("review_url", null);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to activate card. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reviewUrl,
      businessName,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
