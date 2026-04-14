# 🔌 MedusaJS Integration Guide

This guide will help you integrate MedusaJS as your e-commerce backend.

## Why MedusaJS?

- Open-source e-commerce platform
- Headless architecture
- Built-in cart, checkout, and payment processing
- Easy product management
- Extensible with plugins

## Prerequisites

- MedusaJS backend running (locally or deployed)
- Backend URL (e.g., http://localhost:9000)

## Setup Instructions

### 1. Install Medusa Client

\`\`\`bash
npm install @medusajs/medusa-js
\`\`\`

### 2. Create Medusa Client

Create \`lib/medusa.ts\`:

\`\`\`typescript
import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
maxRetries: 3,
})
\`\`\`

### 3. Create Environment Variables

Create \`.env.local\`:

\`\`\`bash
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
\`\`\`

### 4. Update Products Data

Replace \`data/products.ts\` with API calls:

\`\`\`typescript
// lib/api/products.ts
import { medusa } from "@/lib/medusa"
import { Product } from "@/types"

export async function getProducts(): Promise<Product[]> {
const { products } = await medusa.products.list()

return products.map((p) => ({
id: p.id,
name: p.title,
description: p.description,
price: p.variants[0]?.prices[0]?.amount / 100 || 0,
image: p.thumbnail || "",
images: p.images?.map(img => img.url) || [],
inStock: p.variants[0]?.inventory_quantity > 0,
category: p.collection?.title,
}))
}

export async function getProduct(id: string): Promise<Product | null> {
const { product } = await medusa.products.retrieve(id)

if (!product) return null

return {
id: product.id,
name: product.title,
description: product.description,
price: product.variants[0]?.prices[0]?.amount / 100 || 0,
image: product.thumbnail || "",
images: product.images?.map(img => img.url) || [],
inStock: product.variants[0]?.inventory_quantity > 0,
category: product.collection?.title,
}
}
\`\`\`

### 5. Update Cart Store

Replace Zustand cart with Medusa cart:

\`\`\`typescript
// store/cart-store.ts
import { medusa } from "@/lib/medusa"
import { create } from "zustand"

interface CartStore {
cartId: string | null
cart: any | null
createCart: () => Promise<void>
addItem: (variantId: string, quantity: number) => Promise<void>
updateItem: (lineId: string, quantity: number) => Promise<void>
removeItem: (lineId: string) => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
cartId: null,
cart: null,

createCart: async () => {
const { cart } = await medusa.carts.create()
set({ cartId: cart.id, cart })
localStorage.setItem('cart_id', cart.id)
},

addItem: async (variantId: string, quantity: number) => {
const cartId = get().cartId
if (!cartId) {
await get().createCart()
}

    const { cart } = await medusa.carts.lineItems.create(
      get().cartId!,
      { variant_id: variantId, quantity }
    )
    set({ cart })

},

updateItem: async (lineId: string, quantity: number) => {
const { cart } = await medusa.carts.lineItems.update(
get().cartId!,
lineId,
{ quantity }
)
set({ cart })
},

removeItem: async (lineId: string) => {
const { cart } = await medusa.carts.lineItems.delete(
get().cartId!,
lineId
)
set({ cart })
},
}))
\`\`\`

### 6. Update Pages to Use API

#### Products Page

\`\`\`typescript
// app/products/page.tsx
import { getProducts } from "@/lib/api/products"

export default async function ProductsPage() {
const products = await getProducts()

return (
// ... render products
)
}
\`\`\`

#### Product Detail Page

\`\`\`typescript
// app/products/[id]/page.tsx
import { getProduct } from "@/lib/api/products"

export default async function ProductDetailPage({ params }) {
const product = await getProduct(params.id)

return (
// ... render product
)
}
\`\`\`

### 7. Implement Checkout

Create checkout page:

\`\`\`typescript
// app/checkout/page.tsx
'use client'

import { useCartStore } from "@/store/cart-store"
import { medusa } from "@/lib/medusa"

export default function CheckoutPage() {
const { cart } = useCartStore()

const handleCheckout = async (paymentInfo) => {
// Add shipping address
await medusa.carts.update(cart.id, {
shipping_address: {
// ... address fields
}
})

    // Add payment method
    await medusa.carts.addPaymentMethod(cart.id, {
      provider_id: "stripe", // or your payment provider
      data: paymentInfo
    })

    // Complete cart
    const { order } = await medusa.carts.complete(cart.id)

    // Redirect to success page
    router.push(\`/order/\${order.id}\`)

}

return (
// ... checkout form
)
}
\`\`\`

## Testing

1. Start your Medusa backend:
   \`\`\`bash
   cd medusa-backend
   medusa develop
   \`\`\`

2. Start your Next.js frontend:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Test the integration:
   - Browse products
   - Add to cart
   - Complete checkout

## Deployment

When deploying, make sure to set the environment variable:
\`\`\`bash
NEXT_PUBLIC_MEDUSA_URL=https://your-medusa-backend.com
\`\`\`

## Additional Features

### Payment Integration

- Stripe
- PayPal
- Other providers supported by Medusa

### Order Management

- View order history
- Track shipments
- Download invoices

### Customer Accounts

- User registration
- Login/logout
- Profile management

## Resources

- [MedusaJS Documentation](https://docs.medusajs.com)
- [Medusa JS Client](https://docs.medusajs.com/js-client/overview)
- [Next.js Starter](https://github.com/medusajs/nextjs-starter-medusa)

## Support

For issues with MedusaJS integration, check:

- [Medusa Discord](https://discord.gg/medusajs)
- [Medusa GitHub](https://github.com/medusajs/medusa)
