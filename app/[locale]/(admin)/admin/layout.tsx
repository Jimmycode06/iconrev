import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
    >
      {children}
    </div>
  );
}
