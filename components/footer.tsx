import Link from "next/link";
import { Mail, Phone, MapPin, Shield, Truck, ArrowRight } from "lucide-react";
import { IconrevLogo } from "@/components/iconrev-logo";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <IconrevLogo size="sm" showTagline className="items-start" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Built for local businesses that want to win on Google Maps.
              1,200+ locations use Iconrev to collect reviews the easy way.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-green-600" />
                30-day money-back guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-blue-600" />
                Free shipping in 2–3 business days
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  Order a card
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  Contact &amp; free audit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of use
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Returns &amp; refunds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>contact@iconrev.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+1 (512) 555-0142</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Austin, TX</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              We reply within 2 hours on business days
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Iconrev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
