"use client";

import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type ProductFaqSectionProps = {
  className?: string;
};

export function ProductFaqSection({ className }: ProductFaqSectionProps) {
  const t = useTranslations("ProductFaq");

  return (
    <section
      className={cn(
        "bg-white border-t border-border/70 pt-12 md:pt-16 pb-4 md:pb-6",
        className
      )}
      aria-labelledby="product-faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center md:text-left mb-8">
          <h2
            id="product-faq-heading"
            className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight text-foreground text-balance"
          >
            <HelpCircle className="h-7 w-7 md:h-8 md:w-8 shrink-0 text-blue-600" />
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground text-base">
            {t("subtitle")}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger className="text-left">
              {t("q1")}
            </AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-2">
                {t("a1_lead")}
              </p>
              <p>{t("a1_body")}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="2">
            <AccordionTrigger className="text-left">{t("q2")}</AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-2">
                {t("a2_lead")}
              </p>
              <p>{t("a2_body")}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="3">
            <AccordionTrigger className="text-left">{t("q3")}</AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-2">
                {t("a3_lead")}
              </p>
              <p>{t("a3_body")}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="4">
            <AccordionTrigger className="text-left">{t("q4")}</AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-3">
                {t("a4_lead")}
              </p>
              <p className="mb-3">{t("a4_p1")}</p>
              <p className="font-medium text-foreground mb-2">{t("a4_good")}</p>
              <ul className="list-disc pl-5 space-y-2 mb-0">
                <li>{t("a4_li1")}</li>
                <li>{t("a4_li2")}</li>
                <li>{t("a4_li3")}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="5">
            <AccordionTrigger className="text-left">{t("q5")}</AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-2">
                {t("a5_lead")}
              </p>
              <p>{t("a5_body")}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="6">
            <AccordionTrigger className="text-left">{t("q6")}</AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-2">
                {t("a6_lead")}
              </p>
              <p>{t("a6_body")}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="7" className="border-b-0">
            <AccordionTrigger className="text-left">{t("q7")}</AccordionTrigger>
            <AccordionContent>
              <p className="font-semibold text-foreground mb-2">
                {t("a7_lead")}
              </p>
              <p>{t("a7_body")}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
