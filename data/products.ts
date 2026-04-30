import { Product } from "@/types";

/** Photo principale (hero, fiche produit, panier) — plaque CTA avis Google (FR). */
export const PRODUCT_GALLERY_HERO = "/gallery/iconrev-plaque-google-avis-fr.png";

/** Ancien hero studio — 2e slide galerie. */
const PRODUCT_GALLERY_HERO_STUDIO = "/gallery/iconrev-plaque-hero.png";

export const PRODUCT_CARD_IMAGE = PRODUCT_GALLERY_HERO;

/** 2e image galerie fiche produit — plaque (visuel FR). */
export const PRODUCT_GALLERY_SLIDE_2 = "/gallery/iconrev-plaque-fr.png";

/** 5e image galerie — infographie avis Google (FR). */
export const PRODUCT_GALLERY_SLIDE_4 = "/gallery/iconrev-marketing-google-avis.png";

export const GALLERY_IN_STORE_COUNTER = "/gallery/iconrev-in-store-counter.png";

/** Vignette liste des packs — pack 2 plaques (visuel produit deux unités). */
export const PRODUCT_PACK_2_LIST_THUMB = "/gallery/iconrev-pack-2-plaques.png";

/** Vignette liste des packs — pack 5 plaques (visuel produit cinq unités). */
export const PRODUCT_PACK_5_LIST_THUMB = "/gallery/iconrev-pack-5-plaques.png";

export const DEFAULT_PRODUCT_GALLERY = [
  PRODUCT_GALLERY_HERO,
  PRODUCT_GALLERY_HERO_STUDIO,
  PRODUCT_GALLERY_SLIDE_2,
  PRODUCT_GALLERY_SLIDE_4,
];

const enProducts: Product[] = [
  {
    id: "1",
    name: "1 Plate — QR + NFC",
    description:
      "Perfect to get started: place the plate and start collecting reviews quickly. Many customers get 15+ new reviews in the first week. One plate, ready to go.",
    price: 29,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 127,
    advantages: [
      {
        title: "NFC + QR on one plate",
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
          "Scan the QR code after delivery to activate it and choose your business.",
      },
    ],
    inStock: true,
    category: "1 Plate",
    packListThumb: DEFAULT_PRODUCT_GALLERY[0],
  },
  {
    id: "2",
    name: "2 Plates — QR + NFC",
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
          "Reliable NFC activation with QR backup on every plate.",
      },
      {
        title: "Built for the field",
        description:
          "Water and stain resistant, with an elegant matte finish.",
      },
    ],
    inStock: true,
    category: "2 Plates",
    popular: true,
    bestValue: true,
    packListThumb: PRODUCT_PACK_2_LIST_THUMB,
  },
  {
    id: "3",
    name: "5 Plates — QR + NFC",
    description:
      "Equip your entire location. Five plates turn tables, counters and high-traffic zones into review collection points. Best value for multi-zone spaces.",
    price: 89,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 64,
    advantages: [
      {
        title: "Cover the whole location",
        description:
          "Five plates for tables, counters and busy zones, with consistent review prompts everywhere.",
      },
      {
        title: "Best price per plate",
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
    category: "5 Plates",
    packListThumb: PRODUCT_PACK_5_LIST_THUMB,
  },
];

const frProducts: Product[] = [
  {
    id: "1",
    name: "1 Plaque — QR + NFC",
    description:
      "Parfait pour démarrer : posez la plaque et commencez à collecter des avis rapidement. Beaucoup de clients obtiennent 15+ nouveaux avis la première semaine. Une plaque, prête à l'emploi.",
    price: 29,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 127,
    advantages: [
      {
        title: "NFC + QR sur une seule plaque",
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
          "Scannez le QR code après réception pour l'activer et choisir votre établissement.",
      },
    ],
    inStock: true,
    category: "1 Plaque",
    packListThumb: DEFAULT_PRODUCT_GALLERY[0],
  },
  {
    id: "2",
    name: "2 Plaques — QR + NFC",
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
          "Activation fiable par NFC avec QR en secours sur chaque plaque.",
      },
      {
        title: "Conçu pour le terrain",
        description:
          "Résistante à l'eau et aux taches, avec une finition matte élégante.",
      },
    ],
    inStock: true,
    category: "2 Plaques",
    popular: true,
    bestValue: true,
    packListThumb: PRODUCT_PACK_2_LIST_THUMB,
  },
  {
    id: "3",
    name: "5 Plaques — QR + NFC",
    description:
      "Équipez tout votre établissement. Cinq plaques transforment tables, comptoirs et zones passantes en points de collecte d'avis. Le meilleur rapport valeur pour les espaces multi-zones.",
    price: 89,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 64,
    advantages: [
      {
        title: "Couvrez tout l'établissement",
        description:
          "Cinq plaques pour tables, comptoirs et zones fréquentées, avec une demande d'avis cohérente partout.",
      },
      {
        title: "Meilleur prix par plaque",
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
    category: "5 Plaques",
    packListThumb: PRODUCT_PACK_5_LIST_THUMB,
  },
];

export function getProducts(locale: string): Product[] {
  return locale === "fr" ? frProducts : enProducts;
}

/** Default export for backward compat (English) */
export const products = enProducts;
