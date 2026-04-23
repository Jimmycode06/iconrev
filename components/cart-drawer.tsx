"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useCartUI } from "@/store/cart-ui-store";
import { formatPrice } from "@/lib/utils";
import { getBogoFreeQuantity, getPromoLabel } from "@/lib/promotions";
import { useLocale, useTranslations } from "next-intl";

export function CartDrawer() {
  const t = useTranslations("CartDrawer");
  const locale = useLocale();
  const isOpen = useCartUI((s) => s.isOpen);
  const close = useCartUI((s) => s.close);
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(
          locale === "fr"
            ? data?.error || "Une erreur est survenue. Veuillez reessayer."
            : data?.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        locale === "fr"
          ? "Une erreur est survenue. Veuillez reessayer."
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={close}
            aria-hidden
          />

          <motion.div
            key="drawer"
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-label={t("title")}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-bold tracking-tight uppercase">
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={close}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
                  <p className="font-medium text-lg mb-1">
                    {t("empty_title")}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t("empty_desc")}
                  </p>
                  <Button
                    className="bg-google-blue hover:bg-google-blue/90"
                    onClick={close}
                    asChild
                  >
                    <Link href="/products">{t("browse")}</Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((item) => {
                    const promo = item.product.promotion;
                    const freeQty =
                      promo?.type === "bogo"
                        ? getBogoFreeQuantity(item.quantity, promo)
                        : 0;
                    const paidQty = Math.max(0, item.quantity - freeQty);
                    const lineTotal =
                      promo?.type === "bogo"
                        ? item.product.price * paidQty
                        : item.product.price * item.quantity;

                    return (
                      <li key={item.product.id} className="px-5 py-4">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-50 border">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-contain p-1.5"
                              sizes="80px"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-2">
                              <p className="font-medium text-sm leading-tight line-clamp-2">
                                {item.product.name}
                              </p>
                              <p className="font-bold text-sm tabular-nums shrink-0">
                                {formatPrice(lineTotal, locale)}
                              </p>
                            </div>

                            {freeQty > 0 && promo && (
                              <p className="text-xs text-google-green font-medium mt-0.5">
                                {getPromoLabel(promo)}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-2.5">
                              <div className="inline-flex items-center border rounded-lg">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                                  aria-label={t("decrease")}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium tabular-nums select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                                  aria-label={t("increase")}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.product.id)}
                                className="p-1.5 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded-lg transition-colors"
                                aria-label={t("remove")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t px-5 py-4 space-y-3 bg-white">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-semibold">{t("total")}</span>
                  <span className="text-xl font-bold text-google-blue tabular-nums">
                    {formatPrice(total, locale)}
                  </span>
                </div>

                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {t("checkout")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={close}
                  asChild
                >
                  <Link href="/cart">{t("view_cart")}</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
