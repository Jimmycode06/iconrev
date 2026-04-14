"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function IconrevLogoMark({ className }: { className?: string }) {
  const rawId = useId().replace(/:/g, "");
  const gid = `iconrev-mg-${rawId}`;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gid}
          x1="6"
          y1="4"
          x2="36"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1d4ed8" />
          <stop offset="0.45" stopColor="#2563eb" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
      <path
        d="M11 8C9.34315 8 8 9.34315 8 11V14C12 10 22 8 29 12C25 9 18 7 11 8Z"
        fill="white"
        fillOpacity="0.14"
      />
      <path
        fill="white"
        d="M12 10.5h8.8c3.3 0 5.8 2 5.8 5.1 0 2.4-1.5 4.3-3.8 4.8l4.4 9.6h-3.9l-4.1-8.8h-3.8v8.8H12V10.5zm3.5 3.2v7.1h5.4c2 0 3.1-1 3.1-2.7 0-1.7-1.1-2.7-3.1-2.7h-5.4z"
      />
    </svg>
  );
}

type LogoSize = "sm" | "md";

const sizeConfig: Record<
  LogoSize,
  { box: string; word: string; tag: string; gap: string }
> = {
  sm: {
    box: "h-8 w-8",
    word: "text-[1.05rem] leading-none",
    tag: "text-[10px] leading-tight tracking-wide",
    gap: "gap-2.5",
  },
  md: {
    box: "h-10 w-10",
    word: "text-[1.4rem] md:text-[1.5rem] leading-none",
    tag: "text-[11px] leading-tight tracking-wide",
    gap: "gap-3",
  },
};

export function IconrevLogo({
  size = "md",
  showTagline = false,
  className,
}: {
  size?: LogoSize;
  showTagline?: boolean;
  className?: string;
}) {
  const s = sizeConfig[size];

  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn(
          "flex flex-col justify-center",
          showTagline ? "min-h-[2.75rem]" : "min-h-0"
        )}
      >
        <span
          className={cn(
            "font-extrabold tracking-[-0.045em] text-blue-950",
            s.word
          )}
        >
          Iconrev
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-muted-foreground font-semibold uppercase mt-1",
              s.tag
            )}
          >
            Reviews &amp; visibility
          </span>
        )}
      </div>
    </div>
  );
}
