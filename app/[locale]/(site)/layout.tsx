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
          <span className="font-semibold">{t("banner_promo")}</span>
          <span className="hidden sm:inline">{" "}&bull; </span>
          <span className="block sm:inline mt-0.5 sm:mt-0 sm:font-medium">
            {t("banner_pack")}
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
