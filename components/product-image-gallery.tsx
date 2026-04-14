"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  /** Unique URLs; first is default hero */
  images: string[];
  productName: string;
  priority?: boolean;
  className?: string;
};

/**
 * Main product image + thumbnail row (e-commerce style).
 * Dedupes identical URLs so the strip stays meaningful.
 */
export function ProductImageGallery({
  images,
  productName,
  priority = false,
  className,
}: Props) {
  const list = useMemo(
    () => [...new Set(images.filter((u) => typeof u === "string" && u.length > 0))],
    [images]
  );

  const [active, setActive] = useState(0);

  const imagesKey = list.join("|");
  useEffect(() => {
    setActive(0);
  }, [imagesKey]);

  const safeIndex = Math.min(active, Math.max(0, list.length - 1));
  const mainSrc = list[safeIndex];

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
          className={cn(
            "rounded-2xl overflow-hidden bg-muted/20 border border-border/80 shadow-sm",
            "flex justify-center lg:justify-start"
          )}
        >
          <Image
            key={mainSrc}
            src={mainSrc}
            alt={`${productName} — view ${safeIndex + 1}`}
            width={720}
            height={720}
            priority={priority && safeIndex === 0}
            sizes="(max-width: 1024px) min(92vw, 540px), (max-width: 1536px) min(58vw, 680px), 680px"
            className={cn(
              "w-full h-auto object-contain",
              "max-w-[min(100%,520px)] lg:max-w-[min(100%,600px)] xl:max-w-[min(100%,680px)]",
              "drop-shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
            )}
          />
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
