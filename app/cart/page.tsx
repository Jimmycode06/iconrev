"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleBusinessLocation } from "@/components/google-business-location";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { getBogoFreeQuantity, getPromoLabel } from "@/lib/promotions";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart,
    establishment,
  } = useCartStore();
  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!establishment.placeId && !establishment.useCustomName) {
      alert(
        "Please select your business on Google or enter a custom name before checkout."
      );
      return;
    }

    if (establishment.useCustomName && !establishment.businessName.trim()) {
      alert("Please enter your business name.");
      return;
    }

    const businessInfo = {
      placeId: establishment.placeId,
      businessName: establishment.businessName,
      address: establishment.address,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
          businessInfo: businessInfo,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const canPay =
    items.length > 0 &&
    (establishment.placeId || establishment.useCustomName) &&
    (!establishment.useCustomName || establishment.businessName.trim());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Browse packs and add items to get started
          </p>
          <Button
            size="lg"
            className="bg-google-blue hover:bg-google-blue/90"
            asChild
          >
            <Link href="/products">Shop now</Link>
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
          Cart
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
                            src={item.product.image}
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
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.product.description.slice(0, 100)}...
                              </p>
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
                                          item.product.price * paidQty
                                        )}
                                      </div>
                                      {freeQty > 0 && (
                                        <div className="text-sm text-google-green font-medium">
                                          {getPromoLabel(
                                            item.product.promotion
                                          )}{" "}
                                          — {freeQty} free
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="text-xl font-bold text-google-blue">
                                  {formatPrice(
                                    item.product.price * item.quantity
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

            <GoogleBusinessLocation className="mt-6" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Order summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-google-green">
                      Free
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-google-blue">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-google-blue hover:bg-google-blue/90"
                    onClick={handleCheckout}
                    disabled={!canPay}
                  >
                    Proceed to checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear cart
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/products"
                      className="text-sm text-google-blue hover:underline"
                    >
                      Continue shopping
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
