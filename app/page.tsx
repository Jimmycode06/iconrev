"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPackList } from "@/components/product-pack-list";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductAdvantages } from "@/components/product-advantages";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useCartUI } from "@/store/cart-ui-store";
import { formatPrice } from "@/lib/utils";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("1");
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUI((s) => s.open);
  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  const handleAddToCart = () => {
    addItem(selected);
    setJustAdded(true);
    openCart();
  };

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 2500);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  return (
    <div className="flex flex-col">
      <HeroSection />

      <HowItWorksSection />

      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12 max-w-2xl mx-auto"
          >
            <p className="inline-flex items-center rounded-full border border-blue-200/80 bg-gradient-to-r from-sky-100 via-blue-100 to-cyan-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-800 shadow-sm mb-3">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-14 lg:items-center max-w-6xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="min-w-0 w-full"
            >
              <ProductImageGallery
                key={selected.id}
                images={selected.images?.length ? selected.images : [selected.image]}
                productName={selected.name}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="min-w-0 w-full space-y-5"
            >
              <ProductAdvantages key={selected.id} product={selected} />

              <p className="text-sm font-semibold text-foreground">
                Select a pack
              </p>

              <ProductPackList
                variant="select"
                selectedId={selectedId}
                onSelect={setSelectedId}
              />

              <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                {selected.description}
              </p>

              <div className="pt-1">
                <Button
                  className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-500/95 hover:via-blue-500/95 hover:to-cyan-500/95 text-white h-14 px-5 flex flex-row items-center justify-between gap-3.5 text-left font-bold text-base shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                  onClick={handleAddToCart}
                  disabled={!selected.inStock}
                >
                  {justAdded ? (
                    <>
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <Check className="h-5 w-5 shrink-0" />
                        <span className="uppercase tracking-wide text-base sm:text-lg truncate">
                          Added to cart
                        </span>
                      </span>
                      <span className="tabular-nums text-base sm:text-lg font-bold shrink-0">
                        {formatPrice(selected.price)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <ShoppingCart className="h-5 w-5 shrink-0" />
                        <span className="uppercase tracking-wide text-base sm:text-lg truncate">
                          Add to cart
                        </span>
                      </span>
                      <span className="tabular-nums text-base sm:text-lg font-bold shrink-0">
                        {formatPrice(selected.price)}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <FeaturesSection />

      <CTASection />
    </div>
  );
}
