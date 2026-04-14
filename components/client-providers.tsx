"use client";

import { CartDrawer } from "@/components/cart-drawer";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
