import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { StickyBanner } from "@/components/sticky-banner";
import { ClientProviders } from "@/components/client-providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iconrev — Get more Google reviews with NFC & QR cards",
  description:
    "Turn happy customers into Google reviews in one tap. NFC + QR cards built for local businesses. Ship fast, set up in seconds, 30-day guarantee.",
  keywords: [
    "Google review card",
    "NFC review tap",
    "QR code Google reviews",
    "local SEO",
    "Google Business Profile",
    "get more reviews",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} antialiased`}>
        <StickyBanner hideOnScroll>
          <p className="text-xs sm:text-sm font-medium tracking-[0.01em] text-white/95">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2 py-0.5 mr-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              Limited-time offer
            </span>
            <span className="font-semibold">20% OFF</span> + free shipping with code{" "}
            <span className="inline-flex items-center rounded-md border border-white/30 bg-white/15 px-2 py-0.5 font-mono font-bold tracking-[0.08em] text-white">
              LAUNCH20
            </span>
            <span className="hidden sm:inline"> {" "}&bull; Starter pack from $38,90</span>
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
      </body>
    </html>
  );
}
