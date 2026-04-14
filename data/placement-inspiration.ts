import { GALLERY_IN_STORE_COUNTER } from "./products";

export type PlacementIdea = {
  id: string;
  imageSrc: string;
  title: string;
  caption: string;
};

/**
 * Suggested spots for a Google review stand (NFC/QR card or small plaque).
 * Swap `imageSrc` for your own photos in /public/gallery/ anytime.
 */
export const PLACEMENT_IDEAS: PlacementIdea[] = [
  {
    id: "counter",
    imageSrc: GALLERY_IN_STORE_COUNTER,
    title: "Checkout counter",
    caption:
      "Beside the terminal or tip jar — people look right at it when they pay.",
  },
  {
    id: "front-desk",
    imageSrc:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80",
    title: "Front desk",
    caption:
      "Hotels, salons, clinics: ask for a review right after check-in or checkout.",
  },
  {
    id: "table",
    imageSrc:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    title: "Table or booth",
    caption:
      "Cafés and restaurants — keep the card on the table so it’s visible the whole visit.",
  },
  {
    id: "waiting",
    imageSrc:
      "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80",
    title: "Waiting area",
    caption:
      "Queues and lobbies — a natural moment to tap or scan while they wait.",
  },
  {
    id: "desk",
    imageSrc:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    title: "Service desk",
    caption:
      "Studios, agencies, repair shops — end the appointment at the desk with a quick review ask.",
  },
  {
    id: "entrance",
    imageSrc:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    title: "Near the entrance",
    caption:
      "Retail: window ledge or counter by the door — last touchpoint before they leave.",
  },
];
