# 🚀 Quick Start Guide

Get your Plaques Avis Google e-commerce site up and running in 5 minutes!

## Prerequisites

Make sure you have installed:

- Node.js 18 or higher
- npm, yarn, or pnpm

## Installation Steps

### 1️⃣ Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2️⃣ Start Development Server

\`\`\`bash
npm run dev
\`\`\`

### 3️⃣ Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎉 That's it!

Your e-commerce site is now running locally!

## What's Included?

- ✅ Home page with hero section
- ✅ Products listing page
- ✅ Individual product detail pages
- ✅ Shopping cart (with localStorage)
- ✅ About page
- ✅ Contact page with form
- ✅ Floating chat widget
- ✅ Responsive design
- ✅ Framer Motion animations

## Quick Customization

### Change Product Data

Edit \`data/products.ts\` to modify products, prices, and descriptions.

### Update Contact Information

Edit \`components/footer.tsx\` and \`app/contact/page.tsx\`.

### Modify Colors

Edit the Google colors in \`tailwind.config.ts\`:
\`\`\`typescript
google: {
blue: "#4285F4", // Change these values
red: "#EA4335",
yellow: "#FBBC04",
green: "#34A853",
}
\`\`\`

## Next Steps

1. **Customize Products** - Add your own product data
2. **Add Images** - Place images in \`public/\` folder
3. **Connect Backend** - Integrate with MedusaJS (see README.md)
4. **Deploy** - Deploy to Vercel with one command: \`vercel\`

## Need Help?

Check out the full [README.md](README.md) for detailed documentation.

Happy coding! 🎨
