"use client";

import { CartDrawer } from "@/components/cart-drawer";
import { AnalyticsTracker } from "@/components/analytics-tracker";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsTracker />
      {children}
      <CartDrawer />
    </>
  );
}
