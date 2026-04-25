"use client";

import { useEffect, useRef } from "react";

/** Google Ads > conversion "Achat" — valeur `send_to` (ex. AW-…/…). */
const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO;

/** Fires gtag('event','conversion',…) once; value + transaction_id from Stripe session. */
export function GoogleAdsPurchaseConversion({
  amountTotalCents,
  currency = "EUR",
  transactionId,
  enabled,
}: {
  amountTotalCents: number;
  currency?: string;
  transactionId: string;
  enabled: boolean;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || !sendTo || fired.current) return;

    const run = () => {
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      if (typeof w.gtag !== "function") return false;
      fired.current = true;
      w.gtag("event", "conversion", {
        send_to: sendTo,
        value: amountTotalCents / 100,
        currency: currency.toUpperCase(),
        transaction_id: transactionId,
      });
      return true;
    };

    if (run()) return;

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (run() || attempts >= 25) window.clearInterval(id);
    }, 200);

    return () => window.clearInterval(id);
  }, [enabled, amountTotalCents, currency, transactionId]);

  return null;
}
