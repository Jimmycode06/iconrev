import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="has-[[data-variant=inset]]:!bg-white">
      <AdminSidebar variant="inset" />
      <SidebarInset className="!bg-white md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-border/60">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
