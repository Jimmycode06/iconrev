/**
 * Token-bucket rate limiter en mémoire.
 *
 * Suffisant pour bloquer des abus simples (bot qui matraque une route) sur une
 * instance Vercel chaude. Pour une protection multi-région robuste, brancher
 * Upstash Redis (`@upstash/ratelimit`) — voir commentaire en bas du fichier.
 */

type Bucket = {
  tokens: number;
  lastRefillMs: number;
};

const buckets = new Map<string, Bucket>();

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweepMs = Date.now();

function sweepExpired(now: number, ttlMs: number) {
  if (now - lastSweepMs < SWEEP_INTERVAL_MS) return;
  lastSweepMs = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefillMs > ttlMs) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetMs: number;
};

/**
 * @param key Identifiant unique (IP + route, IP + endpoint, etc.).
 * @param limit Capacité max du bucket (= burst).
 * @param windowMs Fenêtre de remplissage complet du bucket.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweepExpired(now, windowMs * 4);

  const refillRatePerMs = limit / windowMs;
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: limit, lastRefillMs: now };
    buckets.set(key, bucket);
  } else {
    const elapsed = now - bucket.lastRefillMs;
    bucket.tokens = Math.min(limit, bucket.tokens + elapsed * refillRatePerMs);
    bucket.lastRefillMs = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      success: true,
      remaining: Math.floor(bucket.tokens),
      resetMs: Math.ceil((1 - bucket.tokens) / refillRatePerMs),
    };
  }

  return {
    success: false,
    remaining: 0,
    resetMs: Math.ceil((1 - bucket.tokens) / refillRatePerMs),
  };
}

/** Extrait l'IP client en respectant les headers Vercel/Cloudflare standards. */
export function clientIp(req: Request): string {
  const headers = req.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * NOTE — Upgrade Upstash :
 * 1) `pnpm add @upstash/ratelimit @upstash/redis`
 * 2) Définir UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN sur Vercel.
 * 3) Remplacer ce module par :
 *    import { Ratelimit } from "@upstash/ratelimit";
 *    import { Redis } from "@upstash/redis";
 *    export const ratelimiter = new Ratelimit({
 *      redis: Redis.fromEnv(),
 *      limiter: Ratelimit.slidingWindow(10, "60 s"),
 *    });
 */
