"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Mail, Info } from "lucide-react";
import { IconrevLogo } from "@/components/iconrev-logo";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useCartUI } from "@/store/cart-ui-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartUI((s) => s.open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showCartBadge = mounted && itemCount > 0;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 mt-12"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          aria-label="Iconrev — Home"
          className="flex items-center rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <IconrevLogo size="md" />
        </Link>

        <nav className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <ListItem
                      href="/about"
                      title="About"
                      icon={<Info className="h-4 w-4" />}
                    >
                      Our mission and how Iconrev works
                    </ListItem>
                    <ListItem
                      href="/contact"
                      title="Contact"
                      icon={<Mail className="h-4 w-4" />}
                    >
                      Talk to our team
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={openCart}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {showCartBadge && (
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon?: React.ReactNode;
  }
>(({ className, title, children, href, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref as any}
          href={href || "#"}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon && <span className="text-blue-600">{icon}</span>}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
