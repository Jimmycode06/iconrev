"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ShoppingBagIcon, LayoutDashboardIcon } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const isFr = locale === "fr";
  const base = `/${locale}`;

  const navMain = [
    {
      title: isFr ? "Vue d'ensemble" : "Overview",
      url: `${base}/admin/orders`,
      icon: LayoutDashboardIcon,
    },
    {
      title: isFr ? "Commandes" : "Orders",
      url: `${base}/admin/orders`,
      icon: ShoppingBagIcon,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={`${base}/admin/orders`}>
                <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                <span className="text-base font-semibold">Iconrev Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
