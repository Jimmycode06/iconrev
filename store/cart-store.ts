import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";
import { getBogoFreeQuantity } from "@/lib/promotions";

export type EstablishmentState = {
  placeId: string | null;
  businessName: string;
  address: string;
  useCustomName: boolean;
};

const defaultEstablishment: EstablishmentState = {
  placeId: null,
  businessName: "",
  address: "",
  useCustomName: false,
};

interface CartStore {
  items: CartItem[];
  establishment: EstablishmentState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setEstablishment: (patch: Partial<EstablishmentState>) => void;
  resetEstablishment: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      establishment: { ...defaultEstablishment },

      setEstablishment: (patch) =>
        set((state) => ({
          establishment: { ...state.establishment, ...patch },
        })),

      resetEstablishment: () =>
        set({ establishment: { ...defaultEstablishment } }),

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const promo = item.product.promotion;
          if (promo?.type === "bogo") {
            const freeQty = getBogoFreeQuantity(item.quantity, promo);
            const paidQty = Math.max(0, item.quantity - freeQty);
            return total + item.product.price * paidQty;
          }

          return total + item.product.price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      merge: (persisted, current) => {
        const p = persisted as Partial<CartStore> | undefined;
        return {
          ...current,
          ...p,
          establishment: {
            ...defaultEstablishment,
            ...(p?.establishment ?? {}),
          },
        };
      },
    }
  )
);
