"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { getPromoLabel } from "@/lib/promotions";
import type { Product } from "@/types";

export function packSubtitle(product: Product): string {
  if (product.id === "1") return "1 card — perfect to try";
  if (product.id === "2") return "2 cards — counter + floor";
  return "4 cards — full location";
}

function PackRowInner({
  product,
  compact,
  reserveCornerBadge,
}: {
  product: Product;
  compact?: boolean;
  /** Extra right padding so top-right ribbon does not cover title/price */
  reserveCornerBadge?: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      <div
        className={cn(
          "flex flex-wrap items-start justify-between gap-x-3 gap-y-1",
          reserveCornerBadge && !compact && "pr-10"
        )}
      >
        <span
          className={cn(
            "font-semibold text-foreground leading-snug tracking-tight text-balance",
            compact ? "text-[11px]" : "text-[13px] sm:text-sm"
          )}
        >
          {product.name}
        </span>
        <span
          className={cn(
            "font-bold tabular-nums shrink-0 tracking-tight text-blue-950",
            compact ? "text-xs" : "text-[15px] sm:text-[17px]"
          )}
        >
          {formatPrice(product.price)}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {product.category && (
          <Badge
            variant="outline"
            className={cn(
              "font-semibold uppercase tracking-wider border-border/80 bg-background/60 text-muted-foreground",
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
            Popular
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
      <p
        className={cn(
          "text-muted-foreground/90 leading-relaxed",
          compact ? "text-[10px]" : "text-[11px] sm:text-[11px]"
        )}
      >
        {packSubtitle(product)}
      </p>
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
  /** Radio select cards only — custom circle + peer-checked styles */
  peerRadio?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-stretch transition-all duration-300 ease-out",
        compact
          ? "gap-2.5 rounded-[11px] p-[10px] sm:p-3"
          : "gap-[13px] rounded-[13px] p-[13px] sm:p-[17px]",
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
  /** Tighter rows and type (e.g. products page sidebar) */
  compact?: boolean;
};

type LinkProps = {
  variant: "link";
  compact?: boolean;
};

export type ProductPackListProps = SelectProps | LinkProps;

export function ProductPackList(props: ProductPackListProps) {
  const compact = "compact" in props ? Boolean(props.compact) : false;

  if (props.variant === "select") {
    const { selectedId, onSelect, radioName = "pack" } = props;
    const packSpacing = compact ? "space-y-1.5" : "space-y-2.5";

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
              <span
                className={cn(
                  "mt-0.5 flex shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all duration-300",
                  "h-3.5 w-3.5 border-muted-foreground/30",
                  isSelected &&
                    "border-blue-600 bg-blue-600 shadow-[0_0_0_1.5px_rgba(37,99,235,0.15)]"
                )}
              >
                <span
                  className={cn(
                    "h-[5px] w-[5px] rounded-full bg-white transition duration-200",
                    isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                />
              </span>
              <PackRowInner product={product} compact />
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
                  className="pointer-events-none absolute right-0 top-0 z-10 h-11 w-11 overflow-hidden rounded-tr-[11px]"
                  aria-hidden
                >
                  <span className="absolute right-[-35%] top-[22%] block w-[140%] rotate-45 border border-white/25 bg-gradient-to-r from-blue-600 to-blue-700 py-[3px] text-center text-[7px] font-bold uppercase leading-none tracking-[0.2em] text-white shadow-[0_1px_4px_rgba(30,58,138,0.35)]">
                    Best deal
                  </span>
                </div>
              ) : null}
              <span className="pack-radio mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/25 bg-white shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-300">
                <span className="pack-radio-inner h-2 w-2 scale-50 rounded-full bg-white opacity-0 transition duration-200" />
              </span>
              <PackRowInner
                product={product}
                compact={false}
                reserveCornerBadge={product.bestValue}
              />
            </PackRowShell>
          )}
        </label>
      );
    });

    return (
      <div
        role="radiogroup"
        aria-label="Card packs"
        className={cn("min-w-0 p-0 m-0", packSpacing)}
      >
        {selectRows}
      </div>
    );
  }

  return (
    <div className={cn(compact ? "space-y-1.5" : "space-y-2.5")} role="list">
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
                className="pointer-events-none absolute right-0 top-0 z-10 h-11 w-11 overflow-hidden rounded-tr-[11px]"
                aria-hidden
              >
                <span className="absolute right-[-35%] top-[22%] block w-[140%] rotate-45 border border-white/25 bg-gradient-to-r from-blue-600 to-blue-700 py-[3px] text-center text-[7px] font-bold uppercase leading-none tracking-[0.2em] text-white shadow-[0_1px_4px_rgba(30,58,138,0.35)]">
                  Best deal
                </span>
              </div>
            )}
            {!compact ? (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/20 bg-gradient-to-b from-white to-slate-50/80 shadow-inner">
                <span className="h-[7px] w-[7px] rounded-full bg-blue-600/20 opacity-60" />
              </span>
            ) : (
              <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30 bg-white" />
            )}
            <PackRowInner
              product={product}
              compact={compact}
              reserveCornerBadge={!compact && product.bestValue}
            />
            <ChevronRight
              className={cn(
                "text-muted-foreground shrink-0 self-center transition-all duration-300",
                "group-hover/link:text-blue-700 group-hover/link:translate-x-0.5",
                compact ? "h-3.5 w-3.5" : "h-[17px] w-[17px]"
              )}
            />
          </PackRowShell>
        </Link>
      ))}
    </div>
  );
}
