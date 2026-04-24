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
        <p className="text-xs sm:text-sm font-medium tracking-[0.01em] text-white/95 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1.5 sm:gap-x-2">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {t("banner_badge")}
          </span>
          <span className="font-medium whitespace-nowrap">
            {t("banner_upto")}{" "}
            <span className="inline-flex items-center rounded-md border border-amber-400/50 bg-amber-500/20 px-1.5 py-0.5 font-bold tabular-nums text-amber-100">
              {t("banner_pct")}
            </span>
          </span>
          <span className="hidden sm:inline text-white/50">&bull;</span>
          <span className="flex w-full sm:w-auto flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-t border-white/10 pt-1.5 sm:border-t-0 sm:pt-0 sm:pl-0 pl-0">
            <span className="font-semibold sm:font-medium">
              {t("banner_pack_prefix")}
            </span>
            <span className="text-white/90">{t("banner_pack_from")}</span>
            <span className="inline-flex items-center rounded-md border border-white/30 bg-white/15 px-2 py-0.5 font-mono text-[13px] font-bold tracking-tight text-white">
              {t("banner_price")}
            </span>
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
