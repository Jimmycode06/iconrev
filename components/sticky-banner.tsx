"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
  hideOnScroll?: boolean;
}

export function StickyBanner({
  children,
  className,
  hideOnScroll = false,
}: StickyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!hideOnScroll || !isMounted) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.scrollY;

      if (scrollY > 40) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll, isMounted]);

  if (!isMounted || isClosed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[100] flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white shadow-[0_10px_30px_rgba(2,6,23,0.35)] border-b border-white/10 backdrop-blur-sm",
            className
          )}
        >
          <div className="container mx-auto flex items-center justify-between gap-3">
            <div className="flex-1 text-center min-w-0">{children}</div>
            <button
              onClick={() => setIsClosed(true)}
              className="ml-2 p-1.5 rounded-full border border-white/20 hover:bg-white/15 transition-colors shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
