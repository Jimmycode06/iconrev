import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iconrev — Get more Google reviews with NFC & QR cards",
  description:
    "Turn happy customers into Google reviews with one tap. NFC + QR cards for local businesses.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${plusJakarta.className} antialiased`}>{children}</body>
    </html>
  );
}
