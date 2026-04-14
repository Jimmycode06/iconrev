"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Shield, Truck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { useCartUI } from "@/store/cart-ui-store";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartUI((s) => s.open);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    openCart();
  };

  const isPopular = Boolean(product.popular);
  const isBestValue = Boolean(product.bestValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-2 ${
          isPopular
            ? "border-google-green ring-2 ring-green-100"
            : isBestValue
            ? "border-emerald-500 ring-2 ring-emerald-100"
            : "hover:border-blue-500"
        } relative`}
      >
        {isPopular && (
          <div className="absolute top-0 left-0 right-0 bg-google-green text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider z-10">
            Popular
          </div>
        )}
        {isBestValue && (
          <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider z-10">
            Best value
          </div>
        )}
        <Link href={`/products/${product.id}`} className="block">
          <div
            className={`relative h-64 w-full overflow-hidden bg-gray-50 flex items-center justify-center ${
              isPopular || isBestValue ? "mt-8" : ""
            }`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
            {product.promotion && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold">
                {product.promotion.label}
              </Badge>
            )}
            {product.inStock && (
              <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                In stock
              </Badge>
            )}
          </div>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
            {product.rating && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                Free 2–3 day ship
              </span>
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                30-day guarantee
              </span>
            </div>
          </CardContent>
        </Link>
        <CardFooter className="p-6 pt-0 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-blue-600">
              {formatPrice(product.price)}
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
