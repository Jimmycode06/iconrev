import Image from "next/image";
import { cn } from "@/lib/utils";
import { PRODUCT_CARD_IMAGE } from "@/data/products";

type Props = {
  className?: string;
  priority?: boolean;
  /** Caption under the image (matches original hero) */
  showCaption?: boolean;
  /** Larger image + full width container (e.g. products page) */
  emphasis?: boolean;
  /** No top padding so the image lines up with adjacent column content (products layout) */
  alignTop?: boolean;
};

/**
 * Product card visual: gradient halo + image, reused on home and products.
 */
export function ProductCardShowcaseVisual({
  className,
  priority = false,
  showCaption = true,
  emphasis = false,
  alignTop = false,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full",
        emphasis
          ? "max-w-2xl mx-auto lg:mx-0 lg:max-w-none"
          : "max-w-md lg:max-w-lg mx-auto",
        className
      )}
    >
      <div
        className={cn(
          "absolute rounded-[2rem] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent blur-2xl",
          emphasis ? "-inset-6 md:-inset-8" : "-inset-4"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative flex",
          emphasis
            ? cn(
                "justify-center lg:justify-start",
                alignTop
                  ? "pt-0 pb-3 px-2 sm:px-0 md:pb-4"
                  : "p-2 md:p-4"
              )
            : "justify-center p-4 md:p-2"
        )}
      >
        <Image
          src={`${PRODUCT_CARD_IMAGE}?v=3`}
          alt="Iconrev review card: tap NFC or scan QR to leave a Google review"
          width={720}
          height={720}
          priority={priority}
          sizes={
            emphasis
              ? "(max-width: 1024px) min(92vw, 540px), (max-width: 1536px) min(58vw, 680px), 680px"
              : "(max-width: 1024px) min(92vw, 420px) 480px"
          }
          className={cn(
            "w-full h-auto drop-shadow-[0_18px_50px_rgba(15,23,42,0.18)]",
            emphasis
              ? "max-w-[min(100%,520px)] lg:max-w-[min(100%,600px)] xl:max-w-[min(100%,680px)]"
              : "max-w-[min(100%,420px)] lg:max-w-[460px]"
          )}
        />
      </div>
      {showCaption && (
        <p
          className={cn(
            "mt-4 text-sm font-medium text-muted-foreground",
            emphasis ? "text-center lg:text-left" : "text-center"
          )}
        >
          What you get: ready to place at the counter or on the floor
        </p>
      )}
    </div>
  );
}
