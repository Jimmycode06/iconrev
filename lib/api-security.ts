import { NextResponse } from "next/server";
import { clientIp, rateLimit, type RateLimitResult } from "@/lib/rate-limit";

/**
 * Vérifie que la requête provient bien du même domaine que l'application.
 * Bloque la majorité des CSRF, même si SameSite=Lax échoue (vieux navigateurs).
 */
export function assertSameOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin) {
    // Beacon analytics legitime utilise sendBeacon qui peut omettre l'origin.
    // On laisse la route appliquer une politique plus stricte si besoin.
    return null;
  }

  try {
    const originUrl = new URL(origin);
    if (host && originUrl.host === host) return null;
  } catch {
    // origin invalide → on rejette
  }

  return NextResponse.json(
    { error: "Cross-origin request rejected" },
    { status: 403 }
  );
}

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
  /** Identifiant logique de l'endpoint pour séparer les buckets. */
  scope: string;
};

/**
 * Applique un rate-limit par IP + scope. Renvoie une NextResponse 429 si la
 * limite est dépassée, sinon `null` (la route peut continuer).
 */
export function enforceRateLimit(
  request: Request,
  config: RateLimitConfig
): NextResponse | null {
  const ip = clientIp(request);
  const key = `${config.scope}:${ip}`;
  const result: RateLimitResult = rateLimit(key, config.limit, config.windowMs);

  if (result.success) return null;

  const retryAfterSec = Math.max(1, Math.ceil(result.resetMs / 1000));
  return NextResponse.json(
    {
      error: "Trop de requêtes. Réessayez dans quelques instants.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    }
  );
}
