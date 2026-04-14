"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Star, ArrowRight, Smartphone, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();

  return (
    <AuroraBackground>
      <section className="relative py-16 md:py-20 lg:py-24 w-full">
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6"
                >
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => router.push("/products")}
                  >
                    <Smartphone className="mr-2 h-5 w-5" />
                    Get my card — from $39
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-2 border-gray-300 hover:bg-gray-50 group"
                    onClick={() => router.push("/about")}
                  >
                    See how it works
                    <ArrowRight className="ml-2 h-5 w-5 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-12 lg:mb-0"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-green-600" />
                    30-day money-back
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Set up in 30 seconds
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Free shipping
                  </span>
                </motion.div>
              </div>

              <div className="hidden lg:block">
                <HeroProductVisual />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="max-w-2xl mx-auto mt-10 lg:mt-14"
            >
              <div className="relative rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm">
                <div className="absolute -top-3 left-6">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full">
                    Real customer result
                  </span>
                </div>
                <div className="flex items-start gap-4 pt-1">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-foreground">
                        Maria D. — Hair salon, Austin, TX
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;In two months I went from 18 to 73 Google reviews. I&apos;m
                      now #1 in my neighborhood on Maps. I had to hire another
                      stylist to keep up with the walk-ins.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
      </section>
    </AuroraBackground>
  );
}
