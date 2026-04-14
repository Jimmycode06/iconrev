import type { Promotion } from "@/types";

export function getPromoLabel(promo: Promotion): string {
  if (promo.type === "bogo") {
    return (
      promo.label ||
      `Buy ${promo.buy}, get ${promo.get} free`
    );
  }
  return promo.label || "";
}

export function getBogoFreeQuantity(
  quantity: number,
  promo: Extract<Promotion, { type: "bogo" }>
): number {
  if (quantity <= 0) return 0;
  if (promo.buy <= 0 || promo.get <= 0) return 0;

  return Math.floor(quantity / promo.buy) * promo.get;
}
