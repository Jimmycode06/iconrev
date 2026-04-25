import { Product } from "@/types";

/** Photo principale (hero, cartes produit, panier) — plaque studio. */
export const PRODUCT_GALLERY_HERO = "/gallery/iconrev-plaque-hero.png";

export const PRODUCT_CARD_IMAGE = PRODUCT_GALLERY_HERO;

/** 2e image galerie fiche produit — plaque (visuel FR). */
export const PRODUCT_GALLERY_SLIDE_2 = "/gallery/iconrev-plaque-fr.png";

/** 3e image galerie — fiche technique (dimensions, NFC, QR). */
export const PRODUCT_GALLERY_SLIDE_3 = "/gallery/iconrev-plaque-specs.png";

/** 4e image galerie — infographie avis Google (FR). */
export const PRODUCT_GALLERY_SLIDE_4 = "/gallery/iconrev-marketing-google-avis.png";

const PRODUCT_GALLERY_SECONDARY = "/carte-iconrev-avis-google.png";

export const GALLERY_IN_STORE_COUNTER = "/gallery/iconrev-in-store-counter.png";

const GALLERY_LIFESTYLE: string[] = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80",
];

export const DEFAULT_PRODUCT_GALLERY = [
  PRODUCT_GALLERY_HERO,
  PRODUCT_GALLERY_SLIDE_2,
  PRODUCT_GALLERY_SLIDE_3,
  PRODUCT_GALLERY_SLIDE_4,
  PRODUCT_GALLERY_SECONDARY,
  ...GALLERY_LIFESTYLE,
];

const enProducts: Product[] = [
  {
    id: "1",
    name: "1 card — QR + NFC",
    description:
      "Perfect to get started: place the card and start collecting reviews quickly. Many customers get 15+ new reviews in the first week. One card, ready to go.",
    price: 29,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 127,
    advantages: [
      {
        title: "NFC + QR on one card",
        description:
          "Customers can scan or tap with any smartphone, no app needed.",
      },
      {
        title: "Direct access to Google reviews",
        description:
          "Opens your Google Business review screen in one step.",
      },
      {
        title: "Ready in under 30 seconds",
        description:
          "Place it on the counter; we link it to your business when we prepare your order.",
      },
    ],
    inStock: true,
    category: "1 card",
  },
  {
    id: "2",
    name: "2 cards — QR + NFC",
    description: "",
    price: 49,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 89,
    advantages: [
      {
        title: "Two touchpoints",
        description:
          "Counter + dining room or waiting area: more chances to ask for a review.",
      },
      {
        title: "Premium NFC + QR",
        description:
          "Reliable NFC activation with QR backup on every card.",
      },
      {
        title: "Built for the field",
        description:
          "Water and stain resistant, with an elegant matte finish.",
      },
    ],
    inStock: true,
    category: "2 cards",
    popular: true,
    bestValue: true,
  },
  {
    id: "3",
    name: "5 cards — QR + NFC",
    description:
      "Equip your entire location. Five cards turn tables, counters and high-traffic zones into review collection points. Best value for multi-zone spaces.",
    price: 89,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 64,
    advantages: [
      {
        title: "Cover the whole location",
        description:
          "Five cards for tables, counters and busy zones, with consistent review prompts everywhere.",
      },
      {
        title: "Best price per card",
        description:
          "The most cost-effective pack for businesses that want to cover all their zones.",
      },
      {
        title: "Full NFC chip + QR",
        description:
          "Maximum compatibility: NFC when convenient, QR everywhere else.",
      },
    ],
    inStock: true,
    category: "5 cards",
  },
];

const frProducts: Product[] = [
  {
    id: "1",
    name: "1 carte — QR + NFC",
    description:
      "Parfait pour démarrer : posez la carte et commencez à collecter des avis rapidement. Beaucoup de clients obtiennent 15+ nouveaux avis la première semaine. Une carte, prête à l'emploi.",
    price: 29,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 127,
    advantages: [
      {
        title: "NFC + QR sur une seule carte",
        description:
          "Les clients peuvent scanner ou approcher avec n'importe quel smartphone, sans application.",
      },
      {
        title: "Accès direct aux avis Google",
        description:
          "Ouvre l'écran d'avis de votre fiche Google en une étape.",
      },
      {
        title: "Prête en moins de 30 secondes",
        description:
          "Posez-la sur le comptoir ; nous la lions à votre établissement lors de la commande.",
      },
    ],
    inStock: true,
    category: "1 carte",
  },
  {
    id: "2",
    name: "2 cartes — QR + NFC",
    description: "",
    price: 49,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 89,
    advantages: [
      {
        title: "Deux points de contact",
        description:
          "Comptoir + salle ou zone d'attente : plus d'occasions de demander un avis.",
      },
      {
        title: "NFC + QR premium",
        description:
          "Activation fiable par NFC avec QR en secours sur chaque carte.",
      },
      {
        title: "Conçu pour le terrain",
        description:
          "Résistante à l'eau et aux taches, avec une finition matte élégante.",
      },
    ],
    inStock: true,
    category: "2 cartes",
    popular: true,
    bestValue: true,
  },
  {
    id: "3",
    name: "5 cartes — QR + NFC",
    description:
      "Équipez tout votre établissement. Cinq cartes transforment tables, comptoirs et zones passantes en points de collecte d'avis. Le meilleur rapport valeur pour les espaces multi-zones.",
    price: 89,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 64,
    advantages: [
      {
        title: "Couvrez tout l'établissement",
        description:
          "Cinq cartes pour tables, comptoirs et zones fréquentées, avec une demande d'avis cohérente partout.",
      },
      {
        title: "Meilleur prix par carte",
        description:
          "Le pack le plus avantageux pour les commerces qui veulent couvrir toutes leurs zones.",
      },
      {
        title: "Puce NFC + QR complet",
        description:
          "Compatibilité maximale : NFC quand c'est pratique, QR partout ailleurs.",
      },
    ],
    inStock: true,
    category: "5 cartes",
  },
];

export function getProducts(locale: string): Product[] {
  return locale === "fr" ? frProducts : enProducts;
}

/** Default export for backward compat (English) */
export const products = enProducts;
