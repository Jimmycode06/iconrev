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
        <p className="text-xs sm:text-sm font-medium tracking-[0.01em] text-white/95 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {t("banner_badge")}
          </span>
          <span className="text-white/95">{t("banner_upto")}</span>
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tabular-nums tracking-[0.08em] text-white">
            {t("banner_pct")}
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
