/**
 * Cookie qui mémorise les checkout sessions Stripe que ce navigateur a créées,
 * pour autoriser /api/checkout/session uniquement à l'acheteur. Évite que
 * quelqu'un avec juste le `session_id` puisse récupérer email + adresse.
 */

import type { NextResponse } from "next/server";

export const CHECKOUT_OWNERSHIP_COOKIE = "iconrev_checkout_owned";
const TTL_SECONDS = 60 * 60; // 1 h
const MAX_TRACKED = 8;

export function isOwnedCheckoutSession(
  cookieValue: string | undefined,
  sessionId: string
): boolean {
  if (!cookieValue) return false;
  return cookieValue
    .split(",")
    .map((s) => s.trim())
    .includes(sessionId);
}

export function rememberCheckoutSession(
  response: NextResponse,
  existingCookie: string | undefined,
  sessionId: string
) {
  const ids = (existingCookie ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!ids.includes(sessionId)) ids.unshift(sessionId);
  const trimmed = ids.slice(0, MAX_TRACKED).join(",");
  response.cookies.set(CHECKOUT_OWNERSHIP_COOKIE, trimmed, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TTL_SECONDS,
    path: "/",
  });
}
