import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit } from "@/lib/api-security";

export const dynamic = "force-dynamic";

const METADATA_MAX_LENGTH = 2000;

const EVENT_TYPES = new Set([
  "page_view",
  "product_view",
  "add_to_cart",
  "checkout_started",
]);

function cleanText(value: unknown, max = 500) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: NextRequest) {
  // Rate-limit généreux : analytics envoie 1 event par page view.
  const limitBlock = enforceRateLimit(request, {
    scope: "analytics",
    limit: 60,
    windowMs: 60_000,
  });
  if (limitBlock) return limitBlock;

  // Vérifie l'origine quand le navigateur l'envoie. sendBeacon ne l'envoie pas
  // toujours, on est donc tolérant si l'header est absent.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost = request.headers.get("host");
      if (requestHost && originHost !== requestHost) {
        return NextResponse.json({ ok: true, skipped: true });
      }
    } catch {
      return NextResponse.json({ ok: true, skipped: true });
    }
  }

  try {
    const body = await request.json();
    const eventType = cleanText(body.eventType, 64);

    if (!eventType || !EVENT_TYPES.has(eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    let metadata: Record<string, unknown> = {};
    if (
      body.metadata &&
      typeof body.metadata === "object" &&
      !Array.isArray(body.metadata)
    ) {
      const serialised = JSON.stringify(body.metadata);
      if (serialised.length <= METADATA_MAX_LENGTH) {
        metadata = body.metadata;
      }
    }

    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      path: cleanText(body.path, 500),
      referrer: cleanText(body.referrer, 1000),
      anonymous_id: cleanText(body.anonymousId, 128),
      session_id: cleanText(body.sessionId, 128),
      user_agent: cleanText(request.headers.get("user-agent"), 1000),
      metadata,
    });

    if (error) {
      console.error("Analytics insert failed:", error);
      return NextResponse.json({ ok: true, skipped: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics tracking failed:", error);
    return NextResponse.json({ ok: true, skipped: true });
  }
}
