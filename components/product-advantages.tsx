"use client";

import { Check, Star } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

type Props = {
  product: Product;
  className?: string;
};

export function ProductAdvantages({ product, className }: Props) {
  const t = useTranslations("ProductAdvantages");
  const locale = useLocale();

  const items = (product.advantages ?? []).slice(0, 3);
  if (items.length === 0) return null;

  const rating = Math.min(5, Math.max(0, product.rating ?? 5));
  const fullStars = Math.round(rating);
  const reviewCount = product.reviews ?? 0;

  const numberLocale = locale === "fr" ? "fr-FR" : "en-US";

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 text-foreground">
          <span className="text-lg leading-none" aria-hidden>
            {locale === "fr" ? "🇫🇷" : "🇺🇸"}
          </span>
          <span className="font-semibold tracking-tight">
            {t("designed_for")}
          </span>
        </span>
        <span
          className="hidden sm:inline h-3 w-px bg-border shrink-0"
          aria-hidden
        />
        <span className="inline-flex items-center gap-2">
          <span className="flex items-center gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i <= fullStars
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/30 text-muted-foreground/40"
                )}
              />
            ))}
          </span>
          <span className="text-muted-foreground">
            {reviewCount > 0 ? (
              <>
                <span className="font-medium text-foreground tabular-nums">
                  {reviewCount.toLocaleString(numberLocale)}
                </span>
                {t("reviews_suffix")}
              </>
            ) : (
              t("top_rated")
            )}
          </span>
        </span>
      </div>

      <ul className="space-y-3.5" role="list">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 text-[15px] leading-snug text-muted-foreground"
          >
            <Check
              className="mt-[3px] h-[18px] w-[18px] shrink-0 text-emerald-600"
              strokeWidth={2.75}
              aria-hidden
            />
            <span>
              <span className="font-bold text-foreground">{item.title}:</span>{" "}
              {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
