"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Check, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleBusinessLocation } from "@/components/google-business-location";
import { ProductPackList } from "@/components/product-pack-list";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductAdvantages } from "@/components/product-advantages";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { ProductFaqSection } from "@/components/product-faq-section";
import { getPlacementIdeas } from "@/data/placement-inspiration";
import { useCartStore } from "@/store/cart-store";
import { useCartUI } from "@/store/cart-ui-store";
import { formatPrice } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { getProducts } from "@/data/products";

function ProductsContent() {
  const t = useTranslations("Products");
  const locale = useLocale();
  const products = getProducts(locale);
  const placementIdeas = getPlacementIdeas(locale);
  const [placementFeatured, ...placementMore] = placementIdeas;

  const searchParams = useSearchParams();
  const packParam = searchParams.get("pack");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUI((s) => s.open);

  const [selectedId, setSelectedId] = useState<string>("1");
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (packParam && products.some((p) => p.id === packParam)) {
      setSelectedId(packParam);
    }
  }, [packParam, products]);

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
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-10"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
          {t("label")}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground text-balance">
          {t("title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          {t("subtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground mb-10 md:mb-12"
      >
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          {t("nfc_badge")}
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-14 lg:items-center mb-12 lg:mb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="min-w-0 w-full"
        >
          <ProductImageGallery
            key={selected.id}
            images={selected.images?.length ? selected.images : [selected.image]}
            productName={selected.name}
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
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
            minimalPackLabels
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
                    {formatPrice(selected.price, locale)}
                  </span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      <HowItWorksSection className="mt-2 md:mt-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-border/70 pt-12 md:pt-16" />

      <ProductFaqSection className="-mx-4 px-4 sm:mx-0 sm:px-0" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-3 text-center md:text-left">
          {t("location_title")}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 text-center md:text-left">
          {t("location_desc")}
        </p>
        <GoogleBusinessLocation />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="max-w-5xl mx-auto mt-16 md:mt-24 pt-12 md:pt-16 border-t border-border/70"
        aria-labelledby="inspiration-heading"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
          {t("inspiration_label")}
        </p>
        <h2
          id="inspiration-heading"
          className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3 text-balance"
        >
          {t("inspiration_title")}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-2xl">
          {t("inspiration_desc")}
        </p>

        {placementFeatured ? (
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-24px" }}
            transition={{ duration: 0.45 }}
            className="mb-12 md:mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
              {t("inspiration_featured_eyebrow")}
            </p>
            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border/80 bg-muted/20 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.06]">
              <div className="relative aspect-[4/3] md:aspect-[2/1] w-full">
                <Image
                  src={placementFeatured.imageSrc}
                  alt={`${placementFeatured.title} — ${t("inspiration_img_alt")}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, min(896px, 90vw)"
                  priority={false}
                />
              </div>
            </div>
            <div className="mt-5 max-w-2xl mx-auto text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-foreground text-balance">
                {placementFeatured.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                {placementFeatured.caption}
              </p>
            </div>
          </motion.article>
        ) : null}

        {placementMore.length > 0 ? (
          <>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90 mb-5">
              {t("inspiration_more_title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-7 max-w-3xl">
              {placementMore.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(i * 0.08, 0.2),
                  }}
                  className="flex flex-col"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/80 bg-muted/20 shadow-sm ring-1 ring-black/[0.04]">
                    <Image
                      src={item.imageSrc}
                      alt={`${item.title} — ${t("inspiration_img_alt")}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                  <h4 className="mt-3 font-semibold text-sm md:text-base text-foreground leading-tight">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs md:text-sm text-muted-foreground leading-snug">
                    {item.caption}
                  </p>
                </motion.article>
              ))}
            </div>
          </>
        ) : null}

        <p className="mt-10 text-sm text-muted-foreground max-w-2xl">
          {t("inspiration_note")}
        </p>
      </motion.section>
    </div>
  );
}

export default function ProductsPage() {
  const t = useTranslations("Products");
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
          {t("loading")}
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
