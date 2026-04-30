"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { getPackDisplayImage } from "@/lib/pack-display-image";
import { formatPrice } from "@/lib/utils";
import { getBogoFreeQuantity, getPromoLabel } from "@/lib/promotions";
import { useTranslations, useLocale } from "next-intl";

export default function CartPage() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart,
  } = useCartStore();
  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, locale }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(t("alert_error"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(t("alert_error"));
    }
  };

  const canPay = items.length > 0;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">{t("empty_title")}</h1>
          <p className="text-muted-foreground mb-8">{t("empty_desc")}</p>
          <Button
            size="lg"
            className="bg-google-blue hover:bg-google-blue/90"
            asChild
          >
            <Link href="/products">{t("shop_now")}</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-google-blue via-google-red to-google-yellow bg-clip-text text-transparent">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Image
                            src={getPackDisplayImage(item.product)}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <Link
                                href={`/products?pack=${item.product.id}`}
                                className="font-semibold text-lg hover:text-google-blue transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              {item.product.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.product.description.slice(0, 100)}...
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              {item.product.promotion?.type === "bogo" ? (
                                (() => {
                                  const freeQty = getBogoFreeQuantity(
                                    item.quantity,
                                    item.product.promotion
                                  );
                                  const paidQty = Math.max(
                                    0,
                                    item.quantity - freeQty
                                  );
                                  return (
                                    <div className="space-y-1">
                                      <div className="text-xl font-bold text-google-blue">
                                        {formatPrice(
                                          item.product.price * paidQty,
                                          locale
                                        )}
                                      </div>
                                      {freeQty > 0 && (
                                        <div className="text-sm text-google-green font-medium">
                                          {getPromoLabel(
                                            item.product.promotion
                                          )}{" "}
                                          — {freeQty} {t("free_qty")}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="text-xl font-bold text-google-blue">
                                  {formatPrice(
                                    item.product.price * item.quantity,
                                    locale
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t("order_summary")}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span className="font-medium">{formatPrice(total, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span className="font-medium text-google-green">
                      {t("shipping_free")}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">{t("total")}</span>
                      <span className="text-2xl font-bold text-google-blue">
                        {formatPrice(total, locale)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-google-blue hover:bg-google-blue/90"
                    onClick={handleCheckout}
                    disabled={!canPay}
                  >
                    {t("checkout")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    {t("clear")}
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/products"
                      className="text-sm text-google-blue hover:underline"
                    >
                      {t("continue")}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
