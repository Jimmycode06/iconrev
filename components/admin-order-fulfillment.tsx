"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  ExternalLinkIcon,
  Loader2Icon,
  TruckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SHIPPING_CARRIERS,
  getCarrierLabel,
  type ShippingCarrierId,
} from "@/lib/shipping-carriers";

type Props = {
  orderId: string;
  isFr: boolean;
  initialOrderStatus: string;
  initialTrackingNumber: string | null;
  initialShippingCarrier: string | null;
  initialTrackingUrl: string | null;
  initialFulfilledAt: string | null;
};

export function AdminOrderFulfillment({
  orderId,
  isFr,
  initialOrderStatus,
  initialTrackingNumber,
  initialShippingCarrier,
  initialTrackingUrl,
  initialFulfilledAt,
}: Props) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = React.useState(initialOrderStatus);
  const [trackingNumber, setTrackingNumber] = React.useState(
    initialTrackingNumber ?? ""
  );
  const [carrier, setCarrier] = React.useState<ShippingCarrierId>(
    (initialShippingCarrier as ShippingCarrierId) || "laposte"
  );
  const [trackingUrl, setTrackingUrl] = React.useState(initialTrackingUrl ?? "");
  const [fulfilledAt, setFulfilledAt] = React.useState(initialFulfilledAt);

  const isFulfilled = orderStatus === "fulfilled";
  const [open, setOpen] = React.useState(!isFulfilled);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOpen(!isFulfilled);
  }, [isFulfilled]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = trackingNumber.trim();
    if (!value) {
      setError(
        isFr ? "Le numéro de suivi est requis." : "Tracking number is required."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/fulfillment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_number: value,
          shipping_carrier: carrier,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error ||
            (isFr ? "Mise à jour impossible." : "Update failed.")
        );
      }

      setOrderStatus(data.order?.order_status ?? "fulfilled");
      setTrackingNumber(data.order?.tracking_number ?? value);
      setCarrier((data.order?.shipping_carrier as ShippingCarrierId) || carrier);
      setTrackingUrl(data.order?.tracking_url ?? "");
      setFulfilledAt(data.order?.fulfilled_at ?? new Date().toISOString());
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReopen() {
    if (!confirm(isFr ? "Annuler le traitement ?" : "Cancel fulfillment?")) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/fulfillment`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error ||
            (isFr ? "Mise à jour impossible." : "Update failed.")
        );
      }
      setOrderStatus(data.order?.order_status ?? "paid");
      setTrackingUrl("");
      setFulfilledAt(null);
      setOpen(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  const fulfilledDate = fulfilledAt
    ? new Date(fulfilledAt).toLocaleString(isFr ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">
            {isFr ? "Expédition" : "Fulfillment"}
          </h2>
          <Badge
            className={
              isFulfilled
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-amber-100 text-amber-800 border-amber-200"
            }
            variant="outline"
          >
            {isFulfilled
              ? isFr
                ? "Traité"
                : "Fulfilled"
              : isFr
              ? "Non traité"
              : "Unfulfilled"}
          </Badge>
        </div>

        {isFulfilled ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReopen}
            disabled={loading}
          >
            {loading ? (
              <Loader2Icon className="mr-1.5 h-4 w-4 animate-spin" />
            ) : null}
            {isFr ? "Annuler le traitement" : "Cancel fulfillment"}
          </Button>
        ) : !open ? (
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
          >
            {isFr ? "Marquer comme traité" : "Mark as fulfilled"}
          </Button>
        ) : null}
      </div>

      {isFulfilled ? (
        <div className="px-5 py-4 text-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>{isFr ? "Service" : "Carrier"} :</span>
            <span className="font-medium text-foreground">
              {getCarrierLabel(carrier) || "—"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>{isFr ? "Numéro de suivi" : "Tracking number"} :</span>
            <span className="font-mono font-medium text-foreground">
              {trackingNumber || "—"}
            </span>
          </div>
          {trackingUrl ? (
            <div>
              <Button asChild variant="outline" size="sm">
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isFr ? "Suivre le colis" : "Track shipment"}
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ) : null}
          {fulfilledDate ? (
            <p className="text-xs text-muted-foreground">
              {isFr ? "Traitée le" : "Fulfilled on"} {fulfilledDate}
            </p>
          ) : null}
        </div>
      ) : open ? (
        <form className="px-5 py-4 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tracking_number" className="text-xs">
                {isFr ? "Numéro de suivi" : "Tracking number"}
              </Label>
              <Input
                id="tracking_number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={
                  isFr ? "Ex. 1A23456789012" : "e.g. 1A23456789012"
                }
                autoComplete="off"
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping_carrier" className="text-xs">
                {isFr ? "Service d'expédition" : "Shipping carrier"}
              </Label>
              <Select
                value={carrier}
                onValueChange={(v) => setCarrier(v as ShippingCarrierId)}
                disabled={loading}
              >
                <SelectTrigger id="shipping_carrier">
                  <SelectValue
                    placeholder={isFr ? "Choisir" : "Choose"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SHIPPING_CARRIERS).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Separator />

          <div className="flex justify-end gap-2">
            {initialOrderStatus !== orderStatus || trackingNumber ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTrackingNumber(initialTrackingNumber ?? "");
                  setCarrier(
                    (initialShippingCarrier as ShippingCarrierId) || "laposte"
                  );
                  setError(null);
                }}
                disabled={loading}
              >
                {isFr ? "Réinitialiser" : "Reset"}
              </Button>
            ) : null}
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? (
                <Loader2Icon className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon className="mr-1.5 h-4 w-4" />
              )}
              {isFr ? "Marquer comme traité" : "Mark as fulfilled"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
