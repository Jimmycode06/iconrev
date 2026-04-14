"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleBusinessLocation } from "@/components/google-business-location";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, establishment } = useCartStore();

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const handleContinue = async () => {
    if (!establishment.placeId && !establishment.useCustomName) {
      alert(
        "Please select your business on Google or enter a custom name."
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

  const canContinue =
    items.length > 0 &&
    (establishment.placeId || establishment.useCustomName) &&
    (!establishment.useCustomName || establishment.businessName.trim());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
        Redirecting…
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
          <h1 className="text-4xl font-bold mb-4">
            Confirm your business
          </h1>
          <p className="text-xl text-muted-foreground">
            We use this to attach the correct Google review link when we prepare
            your cards.
          </p>
        </div>

        <GoogleBusinessLocation className="mb-6" />

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/cart")}
            className="flex-1"
          >
            Back to cart
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Continue to payment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
