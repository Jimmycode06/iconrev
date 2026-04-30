import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ClientProviders } from "@/components/client-providers";

// Activate page is French-only — provide French messages inline
const frMessages = {
  Header: {
    home: "Accueil",
    products: "Produits",
    company: "Entreprise",
    about: "À propos",
    about_desc: "Notre mission et comment Iconrev fonctionne",
    contact: "Contact",
    contact_desc: "Parler à notre équipe",
    account: "Mon compte",
    open_cart: "Ouvrir le panier",
    open_menu: "Ouvrir le menu",
    close_menu: "Fermer le menu",
  },
  Footer: {
    tagline:
      "Conçu pour les commerces locaux qui veulent dominer Google Maps. Plus de 1 200 établissements utilisent Iconrev.",
    quick_links: "Liens rapides",
    home: "Accueil",
    order_card: "Commander une plaque",
    how_it_works: "Comment ça marche",
    contact_audit: "Contact & audit gratuit",
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    shipping: "Livraison",
    returns: "Retours & remboursements",
    contact: "Contact",
    reply_time: "Réponse sous 2 heures ouvrables",
    copyright: "Tous droits réservés.",
  },
  Logo: {
    tagline: "Avis & visibilité",
  },
  CartDrawer: {
    title: "Panier",
    empty_title: "Votre panier est vide",
    empty_desc: "Ajoutez un pack pour commencer",
    browse: "Voir les packs",
    total: "Total",
    checkout: "Commander",
    view_cart: "Voir le panier complet",
    close: "Fermer",
    decrease: "Diminuer",
    increase: "Augmenter",
    remove: "Supprimer",
  },
};

export default function ActivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="fr" messages={frMessages}>
      <ClientProviders>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ClientProviders>
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        />
      ) : null}
    </NextIntlClientProvider>
  );
}
