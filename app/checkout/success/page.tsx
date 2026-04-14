"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";

interface CheckoutSession {
  id: string;
  customer_details: {
    email: string;
    name?: string;
  };
  shipping_details: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      postal_code: string;
      country: string;
    };
    name: string;
  };
  amount_total: number;
  payment_status: string;
  metadata?: {
    business_name?: string;
    business_place_id?: string;
    business_address?: string;
  };
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          clearCart();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Session fetch error:", error);
        setLoading(false);
      });
  }, [sessionId, clearCart]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Session not found</h1>
        <Link href="/products">
          <Button>Back to products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Order confirmed</h1>
          <p className="text-xl text-muted-foreground">
            Thank you — we&apos;ve received your payment.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold text-sm break-all text-right max-w-[60%]">
                {session.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(session.amount_total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {session.payment_status === "paid"
                  ? "Paid"
                  : session.payment_status}
              </span>
            </div>
          </CardContent>
        </Card>

        {session.shipping_details && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Shipping address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{session.shipping_details.name}</p>
                <p className="text-muted-foreground">
                  {session.shipping_details.address.line1}
                  {session.shipping_details.address.line2 &&
                    `, ${session.shipping_details.address.line2}`}
                </p>
                <p className="text-muted-foreground">
                  {session.shipping_details.address.postal_code}{" "}
                  {session.shipping_details.address.city}
                </p>
                <p className="text-muted-foreground">
                  {session.shipping_details.address.country}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {session.metadata?.business_name && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{session.metadata.business_name}</p>
                {session.metadata.business_address && (
                  <p className="text-sm text-muted-foreground">
                    {session.metadata.business_address}
                  </p>
                )}
                {session.metadata.business_place_id && (
                  <p className="text-xs text-muted-foreground">
                    Google Place ID: {session.metadata.business_place_id}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {session.customer_details?.email && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Confirmation email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We sent a confirmation to{" "}
                <span className="font-medium">
                  {session.customer_details.email}
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">What happens next</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• You&apos;ll get an order confirmation email shortly</li>
              <li>• We prepare and ship your cards quickly</li>
              <li>
                • Tracking details will be emailed when your order ships
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Back to home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
