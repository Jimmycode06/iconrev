import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  isAdminEmail,
  parseAdminEmailAllowlist,
} from "@/lib/admin-access";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildTrackingUrl,
  isSupportedCarrier,
} from "@/lib/shipping-carriers";
import { assertSameOrigin, enforceRateLimit } from "@/lib/api-security";

export const dynamic = "force-dynamic";

function getSupabaseUserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.startsWith("http") || !anon?.startsWith("ey")) return null;

  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });
}

async function ensureAdmin(): Promise<{ ok: true } | { ok: false; res: NextResponse }> {
  const supabaseUser = getSupabaseUserClient();
  if (!supabaseUser) {
    return {
      ok: false,
      res: NextResponse.json(
        { error: "Supabase non configuré" },
        { status: 503 }
      ),
    };
  }

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }

  const allow = parseAdminEmailAllowlist();
  if (!isAdminEmail(user.email, allow)) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Accès refusé" }, { status: 403 }),
    };
  }

  return { ok: true };
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const limitBlock = enforceRateLimit(request, {
    scope: "admin-fulfillment",
    limit: 30,
    windowMs: 60_000,
  });
  if (limitBlock) return limitBlock;

  const guard = await ensureAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  let body: {
    tracking_number?: string;
    shipping_carrier?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const trackingNumber = (body.tracking_number ?? "").trim();
  const carrierRaw = (body.shipping_carrier ?? "").trim();

  if (!trackingNumber) {
    return NextResponse.json(
      { error: "Le numéro de suivi est requis." },
      { status: 400 }
    );
  }
  if (trackingNumber.length > 100) {
    return NextResponse.json(
      { error: "Numéro de suivi trop long." },
      { status: 400 }
    );
  }
  if (!isSupportedCarrier(carrierRaw)) {
    return NextResponse.json(
      { error: "Service d'expédition non supporté." },
      { status: 400 }
    );
  }

  const trackingUrl = buildTrackingUrl(carrierRaw, trackingNumber);

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin non configuré" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      order_status: "fulfilled",
      tracking_number: trackingNumber,
      shipping_carrier: carrierRaw,
      tracking_url: trackingUrl,
      fulfilled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id,order_status,tracking_number,shipping_carrier,tracking_url,fulfilled_at"
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Mise à jour impossible" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, order: data });
}

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const limitBlock = enforceRateLimit(request, {
    scope: "admin-fulfillment",
    limit: 30,
    windowMs: 60_000,
  });
  if (limitBlock) return limitBlock;

  const guard = await ensureAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin non configuré" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      order_status: "paid",
      tracking_number: null,
      shipping_carrier: null,
      tracking_url: null,
      fulfilled_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id,order_status,tracking_number,shipping_carrier,tracking_url,fulfilled_at"
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Mise à jour impossible" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, order: data });
}
