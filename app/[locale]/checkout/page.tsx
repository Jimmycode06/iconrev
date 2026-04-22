"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleBusinessLocation } from "@/components/google-business-location";
import { useCartStore } from "@/store/cart-store";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const { items, establishment } = useCartStore();

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const handleContinue = async () => {
    if (!establishment.placeId && !establishment.useCustomName) {
      alert(t("alert_no_business"));
      return;
    }

    if (establishment.useCustomName && !establishment.businessName.trim()) {
      alert(t("alert_no_name"));
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, businessInfo }),
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

  const canContinue =
    items.length > 0 &&
    (establishment.placeId || establishment.useCustomName) &&
    (!establishment.useCustomName || establishment.businessName.trim());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
        {t("redirecting")}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <GoogleBusinessLocation className="mb-6" />

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/cart")}
            className="flex-1"
          >
            {t("back")}
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {t("continue")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
