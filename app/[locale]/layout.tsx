import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { StickyBanner } from "@/components/sticky-banner";
import { ClientProviders } from "@/components/client-providers";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout" });
  if (locale === "fr") {
    return {
      title: "Iconrev — Obtenez plus d'avis Google avec des cartes NFC & QR",
      description:
        "Transformez vos clients satisfaits en avis Google en un scan. Cartes NFC + QR pour les commerces locaux.",
      keywords: [
        "carte avis Google",
        "NFC avis Google",
        "QR code avis Google",
        "SEO local",
        "Google Business Profile",
        "obtenir plus d'avis",
      ],
    };
  }
  return {
    title: "Iconrev — Get more Google reviews with NFC & QR cards",
    description:
      "Turn happy customers into Google reviews with one tap. NFC + QR review cards for local businesses. Fast shipping, setup in seconds.",
    keywords: [
      "Google review card",
      "NFC Google reviews",
      "QR code Google reviews",
      "local SEO",
      "Google Business Profile",
      "get more reviews",
    ],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Layout" });

  return (
    <NextIntlClientProvider messages={messages}>
      <StickyBanner hideOnScroll>
        <p className="text-xs sm:text-sm font-medium tracking-[0.01em] text-white/95">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2 py-0.5 mr-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            {t("banner_badge")}
          </span>
          <span className="font-semibold">{t("banner_discount")}</span>{" "}
          {t("banner_code_text")}{" "}
          <span className="inline-flex items-center rounded-md border border-white/30 bg-white/15 px-2 py-0.5 font-mono font-bold tracking-[0.08em] text-white">
            {t("banner_code")}
          </span>
          <span className="hidden sm:inline">
            {" "}
            &bull; {t("banner_starter")}
          </span>
        </p>
      </StickyBanner>
      <ClientProviders>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </div>
      </ClientProviders>
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        />
      ) : null}
    </NextIntlClientProvider>
  );
}
