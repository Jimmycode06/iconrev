import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { StickyBanner } from "@/components/sticky-banner";
import { ClientProviders } from "@/components/client-providers";
import { getTranslations } from "next-intl/server";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout" });

  return (
    <>
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
            {" "}&bull; {t("banner_starter")}
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
    </>
  );
}
