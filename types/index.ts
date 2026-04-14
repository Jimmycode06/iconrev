export type ProductAdvantage = {
  title: string;
  description: string;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  /** Short benefit bullets (title + body) for product page */
  advantages?: ProductAdvantage[];
  inStock: boolean;
  category?: string;
  /** Badge vert « Populaire » (ex. pack 2 cartes) */
  popular?: boolean;
  /** Mise en avant « meilleure valeur » (ex. pack 4 cartes) */
  bestValue?: boolean;
  promotion?: Promotion;
}

export type Promotion = {
  type: "bogo";
  buy: number;
  get: number;
  label?: string;
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// For future MedusaJS integration
export interface MedusaProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: { url: string }[];
  variants: {
    id: string;
    title: string;
    prices: { amount: number; currency_code: string }[];
  }[];
}
