import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
      <SidebarProvider className="has-[[data-variant=inset]]:!bg-white">
        <AdminSidebar variant="inset" />
        <SidebarInset className="!bg-white md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-border/60">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
