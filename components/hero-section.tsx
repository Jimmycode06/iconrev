"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/aurora-background";
import { ProductCardShowcaseVisual } from "@/components/product-card-showcase-visual";

function HeroProductVisual({ priority = false }: { priority?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.2 }}
    >
      <ProductCardShowcaseVisual priority={priority} />
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <AuroraBackground>
      <section className="relative pt-16 pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12 w-full">
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden [mask-image:radial-gradient(ellipse_85%_55%_at_50%_0%,#000_55%,transparent_100%)]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(37,99,235,0.09),transparent_55%)]" />
          <div className="absolute top-[20%] -right-[20%] h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full bg-cyan-400/[0.07] blur-3xl" />
          <div className="absolute -bottom-[10%] -left-[15%] h-[min(45vw,320px)] w-[min(45vw,320px)] rounded-full bg-blue-600/[0.06] blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 lg:items-center">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 text-center lg:text-left text-foreground leading-[1.08] tracking-tight text-balance"
                >
                  Your competitors are stacking Google reviews.{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Are you?
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 text-center lg:text-left max-w-xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed text-balance"
                >
                  One physical card your customers actually see: NFC + QR, a clear
                  ask, and a direct path to your Google review screen. Less
                  friction — more five-star reviews.
                </motion.p>

                <div className="mb-8 lg:hidden">
                  <HeroProductVisual priority />
                </div>

              </div>

              <div className="hidden lg:block">
                <HeroProductVisual />
              </div>
            </div>

          </div>
        </div>

      </section>
    </AuroraBackground>
  );
}
