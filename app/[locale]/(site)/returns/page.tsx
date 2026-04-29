"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PackageOpen, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function ReturnsPage() {
  const t = useTranslations("Returns");

  const howSteps = [t("s3_li1"), t("s3_li2"), t("s3_li3")];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center gap-3 mb-6 text-blue-600">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Undo2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <PackageOpen className="h-7 w-7 text-indigo-600" aria-hidden />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-balance">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-xl mx-auto">
            {t("subtitle")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t("updated")}</p>
        </div>

        <Card className="mb-8 border-blue-100/80 shadow-sm">
          <CardContent className="p-8 md:p-10 space-y-8 text-left">
            <p className="text-muted-foreground leading-relaxed">{t("intro")}</p>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s1_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {t("s1_p1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("s1_p2")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s2_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("s2_p1")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s3_title")}
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                {howSteps.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s4_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("s4_p1")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s5_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("s5_p1")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s6_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("s6_p1")}
              </p>
            </section>

            <section className="rounded-xl bg-muted/50 p-6 border border-muted">
              <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {t("s7_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("s7_p1")}
              </p>
              <Link
                href="/contact"
                className="text-blue-600 font-medium hover:text-blue-700 underline underline-offset-4"
              >
                {t("contact_link")}
              </Link>
            </section>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
