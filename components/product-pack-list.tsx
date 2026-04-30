"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { getPromoLabel } from "@/lib/promotions";
import type { Product } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { getProducts } from "@/data/products";

function oldPackPrice(product: Product): number {
  if (product.id === "1") return 39;
  if (product.id === "2") return 69;
  return 129;
}

function PackRowInner({
  product,
  compact,
  reserveCornerBadge,
  packTitle,
  bestDealText,
  locale,
  showCategoryOutlineBadge = true,
}: {
  product: Product;
  compact?: boolean;
  reserveCornerBadge?: boolean;
  packTitle: string;
  bestDealText: string;
  locale: string;
  showCategoryOutlineBadge?: boolean;
}) {
  const t = useTranslations("PackList");
  const thumb = product.packListThumb;

  return (
    <div className="flex-1 min-w-0 flex gap-2.5 sm:gap-3 items-start">
      {thumb ? (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-[10px] border border-border/55 bg-muted/25 shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
            compact ? "h-9 w-9 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-[3.75rem] sm:w-[3.75rem]"
          )}
        >
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes={compact ? "40px" : "64px"}
          />
        </div>
      ) : null}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-x-3 gap-y-1",
            reserveCornerBadge && !compact && "pr-9"
          )}
        >
          <span
            className={cn(
              "font-semibold text-foreground leading-snug tracking-tight text-balance",
              compact ? "text-[10px]" : "text-[12px] sm:text-[13px]"
            )}
          >
            {packTitle}
          </span>
          <div className="shrink-0 text-right">
            <span
              className={cn(
                "block font-bold tabular-nums tracking-tight text-blue-950",
                compact ? "text-[11px]" : "text-[14px] sm:text-[15px]"
              )}
            >
              {formatPrice(product.price, locale)}
            </span>
            <span
              className={cn(
                "block tabular-nums text-muted-foreground/80 line-through",
                compact ? "text-[10px]" : "text-[12px]"
              )}
            >
              {formatPrice(oldPackPrice(product), locale)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {showCategoryOutlineBadge && product.category && (
            <Badge
              variant="outline"
              className={cn(
                "font-semibold tracking-wide border-border/80 bg-background/60 text-muted-foreground",
                compact ? "text-[8px] px-1.5 py-0 h-[17px]" : "text-[9px] px-2 py-0 h-[17px]"
              )}
            >
              {product.category}
            </Badge>
          )}
          {product.popular && (
            <Badge
              variant="outline"
              className={cn(
                "font-semibold uppercase tracking-wider border-emerald-200/90 bg-emerald-50/90 text-emerald-800 shadow-none",
                compact ? "text-[8px] px-1.5 py-0 h-[17px]" : "text-[9px] px-2 py-0 h-[17px]"
              )}
            >
              {t("popular")}
            </Badge>
          )}
          {product.promotion && (
            <Badge
              variant="outline"
              className={cn(
                "font-semibold uppercase tracking-wider border-emerald-200/90 bg-emerald-50/90 text-emerald-800",
                compact ? "text-[8px] px-1.5 py-0 h-[17px]" : "text-[9px] px-2 py-0 h-[17px]"
              )}
            >
              {getPromoLabel(product.promotion)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

const packCardPeerClasses =
  "peer-checked:[&_.pack-radio]:border-blue-600 peer-checked:[&_.pack-radio]:bg-blue-600 peer-checked:[&_.pack-radio]:shadow-[0_0_0_2.5px_rgba(37,99,235,0.12)] peer-checked:[&_.pack-radio-inner]:scale-100 peer-checked:[&_.pack-radio-inner]:opacity-100";

function PackRowShell({
  compact,
  interactiveClass,
  children,
  peerRadio = false,
}: {
  compact: boolean;
  interactiveClass: string;
  children: ReactNode;
  peerRadio?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-stretch transition-all duration-300 ease-out",
        compact
          ? "gap-2 rounded-[10px] p-2 sm:p-2.5"
          : "gap-[10px] rounded-[12px] p-[11px] sm:p-[14px]",
        "border-2 border-border/60 bg-gradient-to-b from-card via-card to-muted/[0.35]",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.03)]",
        interactiveClass,
        peerRadio && packCardPeerClasses
      )}
    >
      {children}
    </div>
  );
}

type SelectProps = {
  variant: "select";
  selectedId: string;
  onSelect: (id: string) => void;
  radioName?: string;
  compact?: boolean;
};

type LinkProps = {
  variant: "link";
  compact?: boolean;
};

export type ProductPackListProps = SelectProps | LinkProps;

export function ProductPackList(props: ProductPackListProps) {
  const t = useTranslations("PackList");
  const locale = useLocale();
  const products = getProducts(locale);
  const compact = "compact" in props ? Boolean(props.compact) : false;

  const bestDealText = t("best_deal");

  if (props.variant === "select") {
    const { selectedId, onSelect, radioName = "pack" } = props;
    const packSpacing = compact ? "space-y-1" : "space-y-2";

    const selectRows = products.map((product) => {
      const isSelected = product.id === selectedId;
      return (
        <label
          key={product.id}
          className={cn(
            "block cursor-pointer select-none",
            compact && "group/pack"
          )}
        >
          <input
            type="radio"
            name={radioName}
            value={product.id}
            checked={isSelected}
            onChange={() => onSelect(product.id)}
            className="peer sr-only"
          />
          {compact ? (
            <PackRowShell
              compact
              interactiveClass={cn(
                "hover:border-foreground/15 hover:shadow-md",
                isSelected &&
                  "border-blue-600/40 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/30 shadow-md ring-2 ring-blue-600/10"
              )}
            >
              <PackRowInner
                product={product}
                compact
                packTitle={product.name}
                showCategoryOutlineBadge
                bestDealText={bestDealText}
                locale={locale}
              />
            </PackRowShell>
          ) : (
            <PackRowShell
              compact={false}
              peerRadio
              interactiveClass={cn(
                "hover:border-foreground/[0.12] hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]",
                "peer-checked:border-blue-600/40 peer-checked:bg-gradient-to-br peer-checked:from-blue-50/95 peer-checked:via-white peer-checked:to-sky-50/25",
                "peer-checked:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.22)] peer-checked:ring-2 peer-checked:ring-blue-600/[0.12]"
              )}
            >
              {product.bestValue ? (
                <div
                  className="pointer-events-none absolute right-0 top-0 z-10 h-10 w-10 overflow-hidden rounded-tr-[10px]"
                  aria-hidden
                >
                  <span className="absolute right-[-35%] top-[24%] block w-[140%] rotate-45 border border-white/25 bg-gradient-to-r from-blue-600 to-blue-700 py-[2px] text-center text-[6px] font-bold uppercase leading-none tracking-[0.18em] text-white shadow-[0_1px_4px_rgba(30,58,138,0.35)]">
                    {bestDealText}
                  </span>
                </div>
              ) : null}
              <PackRowInner
                product={product}
                compact={false}
                reserveCornerBadge={product.bestValue}
                packTitle={product.name}
                showCategoryOutlineBadge
                bestDealText={bestDealText}
                locale={locale}
              />
            </PackRowShell>
          )}
        </label>
      );
    });

    return (
      <div
        role="radiogroup"
        aria-label={t("aria_label")}
        className={cn("min-w-0 p-0 m-0", packSpacing)}
      >
        {selectRows}
      </div>
    );
  }

  return (
    <div className={cn(compact ? "space-y-1" : "space-y-2")} role="list">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products?pack=${product.id}`}
          role="listitem"
          className={cn(
            "block text-left transition-transform duration-300",
            !compact && "hover:-translate-y-0.5"
          )}
        >
          <PackRowShell
            compact={compact}
            interactiveClass={cn(
              "group/link border-border/60 hover:border-foreground/[0.12]",
              "hover:shadow-[0_10px_32px_rgba(15,23,42,0.08)]",
              product.bestValue &&
                !compact &&
                "ring-1 ring-blue-600/[0.08] hover:ring-blue-600/15"
            )}
          >
            {!compact && product.bestValue && (
              <div
                className="pointer-events-none absolute right-0 top-0 z-10 h-10 w-10 overflow-hidden rounded-tr-[10px]"
                aria-hidden
              >
                <span className="absolute right-[-35%] top-[24%] block w-[140%] rotate-45 border border-white/25 bg-gradient-to-r from-blue-600 to-blue-700 py-[2px] text-center text-[6px] font-bold uppercase leading-none tracking-[0.18em] text-white shadow-[0_1px_4px_rgba(30,58,138,0.35)]">
                  {bestDealText}
                </span>
              </div>
            )}
            <PackRowInner
              product={product}
              compact={compact}
              reserveCornerBadge={!compact && product.bestValue}
              packTitle={product.name}
              showCategoryOutlineBadge
              bestDealText={bestDealText}
              locale={locale}
            />
            <ChevronRight
              className={cn(
                "text-muted-foreground shrink-0 self-center transition-all duration-300",
                "group-hover/link:text-blue-700 group-hover/link:translate-x-0.5",
                compact ? "h-3 w-3" : "h-[15px] w-[15px]"
              )}
            />
          </PackRowShell>
        </Link>
      ))}
    </div>
  );
}
