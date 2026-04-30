import type { Product } from "@/types";
import {
  DEFAULT_PRODUCT_GALLERY,
  PRODUCT_PACK_2_LIST_THUMB,
  PRODUCT_PACK_5_LIST_THUMB,
} from "@/data/products";

/** Image à afficher pour un pack : vignette liste (si définie) ou visuel selon l’id du produit. */
export function getPackDisplayImage(
  product: Pick<Product, "id" | "image" | "packListThumb">
): string {
  if (product.packListThumb) return product.packListThumb;
  return packImageUrlForProductId(product.id);
}

/** Résolution côté serveur / paniers anciens sans packListThumb. */
export function packImageUrlForProductId(id: string): string {
  if (id === "2") return PRODUCT_PACK_2_LIST_THUMB;
  if (id === "3") return PRODUCT_PACK_5_LIST_THUMB;
  return DEFAULT_PRODUCT_GALLERY[0];
}
