const ANONYMOUS_ID_KEY = "iconrev_analytics_id";
const SESSION_ID_KEY = "iconrev_analytics_session_id";
const SESSION_STARTED_AT_KEY = "iconrev_analytics_session_started_at";
const SESSION_TTL_MS = 30 * 60 * 1000;

export type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_started";

function randomId(prefix: string) {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return `${prefix}_${cryptoApi.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getStoredId(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const created = randomId(prefix);
  window.localStorage.setItem(key, created);
  return created;
}

function getSessionId() {
  const now = Date.now();
  const startedAt = Number(
    window.sessionStorage.getItem(SESSION_STARTED_AT_KEY) ?? 0
  );
  const currentSession = window.sessionStorage.getItem(SESSION_ID_KEY);

  if (currentSession && now - startedAt < SESSION_TTL_MS) {
    window.sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(now));
    return currentSession;
  }

  const nextSession = randomId("ses");
  window.sessionStorage.setItem(SESSION_ID_KEY, nextSession);
  window.sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(now));
  return nextSession;
}

export function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  metadata: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  if (navigator.doNotTrack === "1") return;

  const payload = {
    eventType,
    path: window.location.pathname,
    referrer: document.referrer || null,
    anonymousId: getStoredId(ANONYMOUS_ID_KEY, "anon"),
    sessionId: getSessionId(),
    metadata,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics should never interrupt the customer journey.
  });
}
