export type ShippingCarrierId = "laposte";

export const SHIPPING_CARRIERS: Record<
  ShippingCarrierId,
  { id: ShippingCarrierId; label: string; trackingUrl: (n: string) => string }
> = {
  laposte: {
    id: "laposte",
    label: "La Poste",
    trackingUrl: (n) =>
      `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(
        n
      )}`,
  },
};

export function isSupportedCarrier(
  value: string | null | undefined
): value is ShippingCarrierId {
  return !!value && value in SHIPPING_CARRIERS;
}

export function buildTrackingUrl(
  carrier: ShippingCarrierId,
  trackingNumber: string
): string {
  return SHIPPING_CARRIERS[carrier].trackingUrl(trackingNumber);
}

export function getCarrierLabel(carrier: string | null | undefined): string {
  if (isSupportedCarrier(carrier)) {
    return SHIPPING_CARRIERS[carrier].label;
  }
  return carrier ?? "";
}
