import { Product } from "@/types";

/** Product hero image (same asset sitewide) */
export const PRODUCT_CARD_IMAGE = "/carte-iconrev-avis-google.png";

/**
 * Lifestyle: your card on a real counter (boutique checkout). Add more files
 * under /public/gallery/ and reference them here for extra vignettes.
 */
export const GALLERY_IN_STORE_COUNTER = "/gallery/iconrev-in-store-counter.png";

/**
 * Extra gallery photos (dining, workspace, retail). Unsplash — replace anytime.
 */
const GALLERY_LIFESTYLE: string[] = [
  "/gallery/top1-marketing.png",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80",
];

/** Product gallery thumbnails (main pack shot + lifestyle stock). In-store “counter” example is shown separately lower on the products page. */
export const DEFAULT_PRODUCT_GALLERY = [
  PRODUCT_CARD_IMAGE,
  ...GALLERY_LIFESTYLE,
];

export const products: Product[] = [
  {
    id: "1",
    name: "Starter — 1 QR + NFC card",
    description:
      "Perfect to try it out: place the card and start collecting reviews fast. Many customers see 15+ new reviews in the first week. One card, ready to use.",
    price: 38.9,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 127,
    advantages: [
      {
        title: "NFC + QR in one card",
        description:
          "Customers tap or scan with any phone — no app download required.",
      },
      {
        title: "Straight to Google reviews",
        description:
          "Opens your Business Profile review screen in a single step.",
      },
      {
        title: "Ready in under 30 seconds",
        description:
          "Place it on the counter; we link it to your location when you order.",
      },
    ],
    inStock: true,
    category: "Starter",
  },
  {
    id: "2",
    name: "Pro — 2 QR + NFC cards",
    description: "",
    price: 69.9,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 89,
    advantages: [
      {
        title: "Two touchpoints",
        description:
          "Counter plus dining or waiting area — more chances to ask for a review.",
      },
      {
        title: "Premium NFC + QR",
        description:
          "Reliable tap-to-review with a clear scan backup on every card.",
      },
      {
        title: "Built for real venues",
        description:
          "Water- and stain-resistant with a sleek matte look customers notice.",
      },
    ],
    inStock: true,
    category: "Pro",
    popular: true,
    bestValue: true,
  },
  {
    id: "3",
    name: "Business — 5 QR + NFC cards",
    description:
      "Equip your whole location. Five cards turn tables, counters, and high-traffic spots into review touchpoints. Best value for multi-zone setups.",
    price: 89.9,
    image: PRODUCT_CARD_IMAGE,
    images: [...DEFAULT_PRODUCT_GALLERY],
    rating: 5,
    reviews: 64,
    advantages: [
      {
        title: "Cover the whole floor",
        description:
          "Five cards for tables, counters, and busy spots — one consistent ask everywhere.",
      },
      {
        title: "Best per-card value",
        description:
          "Best value pack for multi-zone businesses that need full in-store coverage.",
      },
      {
        title: "NFC chip + QR both sides",
        description:
          "Maximum compatibility: tap where it’s easy, scan everywhere else.",
      },
    ],
    inStock: true,
    category: "Business",
  },
];
