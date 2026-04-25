"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  /** Unique URLs; first is default hero */
  images: string[];
  productName: string;
  priority?: boolean;
  className?: string;
};

const SWIPE_MIN_PX = 48;

/**
 * Main product image + optional carousel (swipe on touch, arrows, keyboard) + thumbnail row.
 * Dedupes identical URLs so the strip stays meaningful.
 */
export function ProductImageGallery({
  images,
  productName,
  priority = false,
  className,
}: Props) {
  const t = useTranslations("Products");
  const list = useMemo(
    () => [...new Set(images.filter((u) => typeof u === "string" && u.length > 0))],
    [images]
  );

  const [active, setActive] = useState(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const imagesKey = list.join("|");
  useEffect(() => {
    setActive(0);
  }, [imagesKey]);

  const safeIndex = Math.min(active, Math.max(0, list.length - 1));
  const mainSrc = list[safeIndex];
  const canNavigate = list.length > 1;

  const goPrev = useCallback(() => {
    setActive((i) => (i <= 0 ? list.length - 1 : i - 1));
  }, [list.length]);

  const goNext = useCallback(() => {
    setActive((i) => (i >= list.length - 1 ? 0 : i + 1));
  }, [list.length]);

  useEffect(() => {
    const el = regionRef.current;
    if (!el || !canNavigate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [canNavigate, goPrev, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    touchRef.current = { x: p.clientX, y: p.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current || !canNavigate) {
      touchRef.current = null;
      return;
    }
    const end = e.changedTouches[0];
    const dx = end.clientX - touchRef.current.x;
    const dy = end.clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) < SWIPE_MIN_PX) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  if (!mainSrc) return null;

  const showThumbnails = list.length > 1;

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none",
        className
      )}
    >
      <div className="relative">
        <div
          ref={regionRef}
          role="region"
          aria-label={t("gallery_region")}
          tabIndex={canNavigate ? 0 : undefined}
          className={cn(
            "relative rounded-2xl overflow-hidden bg-muted/20 border border-border/80 shadow-sm outline-none",
            "focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2",
            canNavigate && "touch-pan-y select-none"
          )}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex justify-center lg:justify-start">
            <Image
              key={mainSrc}
              src={mainSrc}
              alt={`${productName} — view ${safeIndex + 1}`}
              width={720}
              height={720}
              priority={priority && safeIndex === 0}
              draggable={false}
              sizes="(max-width: 1024px) min(92vw, 540px), (max-width: 1536px) min(58vw, 680px), 680px"
              className={cn(
                "w-full h-auto object-contain",
                "max-w-[min(100%,520px)] lg:max-w-[min(100%,600px)] xl:max-w-[min(100%,680px)]",
                "drop-shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
              )}
            />
          </div>

          {canNavigate && (
            <>
              <div className="absolute inset-y-0 left-0 z-[1] flex items-center pl-0.5 sm:pl-1 pointer-events-none">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={t("gallery_prev")}
                  className={cn(
                    "pointer-events-auto inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center",
                    "rounded-full border-0 bg-transparent p-0 shadow-none",
                    "text-foreground/50 hover:text-foreground/80 active:text-foreground",
                    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  )}
                >
                  <ChevronLeft
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 z-[1] flex items-center pr-0.5 sm:pr-1 pointer-events-none">
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={t("gallery_next")}
                  className={cn(
                    "pointer-events-auto inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center",
                    "rounded-full border-0 bg-transparent p-0 shadow-none",
                    "text-foreground/50 hover:text-foreground/80 active:text-foreground",
                    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  )}
                >
                  <ChevronRight
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>
              </div>
            </>
          )}
        </div>

        {showThumbnails && (
          <div
            className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2.5"
            role="tablist"
            aria-label="Product gallery thumbnails"
          >
            {list.map((src, i) => {
              const selected = i === safeIndex;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Show image ${i + 1} of ${list.length}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2",
                    selected
                      ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-background"
                      : "ring-2 ring-transparent hover:ring-border opacity-90 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 22vw, 120px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
