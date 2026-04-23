"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ShoppingBagIcon,
  LayoutDashboardIcon,
  HomeIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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

  const navSecondary = [
    {
      title: isFr ? "Retour au site" : "Back to site",
      url: `${base}`,
      icon: HomeIcon,
    },
    {
      title: isFr ? "Paramètres" : "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: isFr ? "Aide" : "Help",
      url: "#",
      icon: HelpCircleIcon,
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
              <Link href={base}>
                <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                <span className="text-base font-semibold">Iconrev Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
