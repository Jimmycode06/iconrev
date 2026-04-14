# Plaques Avis Google - E-commerce Site

A modern, beautiful e-commerce website built with Next.js 14, TailwindCSS, and TypeScript for selling Google Review Plaques.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- ✨ Modern, Google-inspired design with colorful accents
- 🛍️ Complete e-commerce functionality (front-end)
- 🛒 Shopping cart with localStorage persistence
- 💬 Integrated chat widget for customer support
- 🎨 Beautiful UI components powered by shadcn/ui
- ⚡ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🔍 Product catalog with detailed product pages
- 🎯 SEO-optimized
- 🚀 Ready for MedusaJS integration

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Future Backend:** MedusaJS (ready for integration)

## Pages

- **Home** - Hero section with featured products
- **Products** - Product catalog
- **Product Detail** - Detailed product information
- **Cart** - Shopping cart with quantity management
- **About** - Company information
- **Contact** - Contact form with company details

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd Review
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

# or

yarn install

# or

pnpm install
\`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev

# or

yarn dev

# or

pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/ # Next.js 14 App Router
│ ├── about/ # About page
│ ├── cart/ # Shopping cart page
│ ├── contact/ # Contact page
│ ├── products/ # Products listing & detail pages
│ │ └── [id]/ # Dynamic product detail page
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ └── globals.css # Global styles
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ ├── header.tsx # Header component
│ ├── footer.tsx # Footer component
│ ├── product-card.tsx # Product card component
│ └── chat-widget.tsx # Chat support widget
├── data/ # Static data
│ └── products.ts # Product data (to be replaced with MedusaJS)
├── lib/ # Utility functions
│ └── utils.ts # Helper functions
├── store/ # State management
│ └── cart-store.ts # Zustand cart store
├── types/ # TypeScript types
│ └── index.ts # Type definitions
└── public/ # Static assets
\`\`\`

## Key Features Explained

### Shopping Cart

The shopping cart uses Zustand for state management and localStorage for persistence. Cart data persists across sessions.

### Chat Widget

A floating chat button provides instant customer support. The chat interface is fully functional and can be integrated with your preferred chat service.

### Product Data

Currently uses static product data in \`data/products.ts\`. This is designed to be easily replaced with MedusaJS API calls.

### Google-Inspired Design

The design uses Google's brand colors (Blue: #4285F4, Red: #EA4335, Yellow: #FBBC04, Green: #34A853) throughout the interface for a modern, trustworthy look.

## Integrating MedusaJS

This project is prepared for MedusaJS integration. To connect:

1. Install Medusa client:
   \`\`\`bash
   npm install @medusajs/medusa-js
   \`\`\`

2. Create a Medusa client in \`lib/medusa.ts\`:
   \`\`\`typescript
   import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
maxRetries: 3,
})
\`\`\`

3. Update \`data/products.ts\` to fetch from Medusa API
4. Implement checkout flow with Medusa's cart and checkout APIs

## Customization

### Colors

Edit Google colors in \`tailwind.config.ts\`:
\`\`\`typescript
google: {
blue: "#4285F4",
red: "#EA4335",
yellow: "#FBBC04",
green: "#34A853",
}
\`\`\`

### Products

Modify products in \`data/products.ts\` or connect to your backend.

### Contact Information

Update contact details in \`components/footer.tsx\` and \`app/contact/page.tsx\`.

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

This Next.js app can be deployed on:

- **Vercel** (recommended)
- **Netlify**
- **Any Node.js hosting**

For Vercel:
\`\`\`bash
vercel
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For questions or support, contact us at contact@plaquesavisgoogle.com

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS
