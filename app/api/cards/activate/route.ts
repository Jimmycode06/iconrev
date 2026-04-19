import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  try {
    const body = await request.json();
    const { cardId, googlePlaceId, businessName, businessAddress } = body;

    if (!cardId || !googlePlaceId || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields: cardId, googlePlaceId, businessName" },
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
      .select("id, review_url, owner_id")
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
