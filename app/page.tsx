"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPackList } from "@/components/product-pack-list";
import { ProductCardShowcaseVisual } from "@/components/product-card-showcase-visual";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { AIResponsesSection } from "@/components/ai-responses-section";
import { CTASection } from "@/components/cta-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <HowItWorksSection />

      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12 max-w-2xl mx-auto"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
              Our cards
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
              Choose your pack
            </h2>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Same flow as the product page: pick a pack, then tell us which
              location it&apos;s for so we can prepare your order with the right
              Google profile.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground mb-10 md:mb-12"
          >
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-blue-600" />
              Free shipping in 2–3 business days
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              30-day money-back guarantee
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Starter pack: 1 card
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-5xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <ProductCardShowcaseVisual showCaption={false} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="space-y-3 w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none"
            >
              <p className="text-xs font-medium text-muted-foreground">
                Tap a pack to continue
              </p>
              <ProductPackList variant="link" />
              <div className="pt-2">
                <Button
                  className="w-full bg-google-blue hover:bg-google-blue/90"
                  asChild
                >
                  <Link href="/products">
                    Full product page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <FeaturesSection />

      <AIResponsesSection />

      <CTASection />
    </div>
  );
}
