import { GALLERY_IN_STORE_COUNTER } from "./products";

export type PlacementIdea = {
  id: string;
  imageSrc: string;
  title: string;
  caption: string;
};

/**
 * Suggested spots for a Google review stand. First item is the hero / real context photo;
 * the next entries are a small set of extra ideas (stock imagery).
 */
const EN_PLACEMENT_IDEAS: PlacementIdea[] = [
  {
    id: "counter",
    imageSrc: GALLERY_IN_STORE_COUNTER,
    title: "At the checkout counter",
    caption:
      "Right where people pay—your stand is visible and they can tap or scan in one gesture.",
  },
  {
    id: "front-desk",
    imageSrc:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80",
    title: "Front desk",
    caption:
      "Hotels, salons, clinics: a natural moment right after check-in or the counter.",
  },
  {
    id: "table",
    imageSrc:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    title: "Table or booth",
    caption:
      "Cafés and restaurants: keep the card in sight for the whole visit.",
  },
];

const FR_PLACEMENT_IDEAS: PlacementIdea[] = [
  {
    id: "counter",
    imageSrc: GALLERY_IN_STORE_COUNTER,
    title: "Comptoir de caisse",
    caption:
      "Au moment du paiement, comme dans cette boutique : le client approche son téléphone et laisse un avis en quelques secondes.",
  },
  {
    id: "front-desk",
    imageSrc:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80",
    title: "Accueil",
    caption:
      "Hôtels, salons, cliniques : un moment naturel juste après l'accueil ou la caisse.",
  },
  {
    id: "table",
    imageSrc:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    title: "Table ou banquette",
    caption:
      "Cafés et restaurants : la carte reste visible pendant toute la visite.",
  },
];

export function getPlacementIdeas(locale: string): PlacementIdea[] {
  return locale === "fr" ? FR_PLACEMENT_IDEAS : EN_PLACEMENT_IDEAS;
}

export const PLACEMENT_IDEAS = EN_PLACEMENT_IDEAS;
