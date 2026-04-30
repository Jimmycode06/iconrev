"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPackList } from "@/components/product-pack-list";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductAdvantages } from "@/components/product-advantages";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { useCartStore } from "@/store/cart-store";
import { useCartUI } from "@/store/cart-ui-store";
import { formatPrice } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { getProducts } from "@/data/products";

function oldPackPrice(productId: string): number {
  if (productId === "1") return 39;
  if (productId === "2") return 69;
  return 129;
}

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const products = getProducts(locale);

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
              {t("pack_label")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
              {t("pack_title")}
            </h2>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              {t("pack_desc")}
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
                {t("select_pack")}
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
                  className="w-full border border-white/10 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white h-14 px-5 flex flex-row items-center justify-between gap-3.5 text-left font-bold text-base shadow-[0_10px_30px_rgba(2,6,23,0.35)] hover:from-slate-900 hover:via-blue-900 hover:to-slate-800"
                  onClick={handleAddToCart}
                  disabled={!selected.inStock}
                >
                  {justAdded ? (
                    <>
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <Check className="h-5 w-5 shrink-0" />
                        <span className="uppercase tracking-wide text-base sm:text-lg truncate">
                          {t("added_to_cart")}
                        </span>
                      </span>
                      <span className="tabular-nums text-base sm:text-lg font-bold shrink-0">
                        {formatPrice(selected.price, locale)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <ShoppingCart className="h-5 w-5 shrink-0" />
                        <span className="uppercase tracking-wide text-base sm:text-lg truncate">
                          {t("add_to_cart")}
                        </span>
                      </span>
                      <span className="tabular-nums text-base sm:text-lg font-bold shrink-0">
                        <span className="mr-2 text-white/65 line-through text-sm sm:text-base font-semibold">
                          {formatPrice(oldPackPrice(selected.id), locale)}
                        </span>
                        {formatPrice(selected.price, locale)}
                      </span>
                    </>
                  )}
                </Button>
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 flex items-center gap-2">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>{t("shipping_note")}</span>
                </div>
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
