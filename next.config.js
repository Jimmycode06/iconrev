const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Allowlist d'origines auxquelles next/image peut faire des requêtes.
 * Évite que /_next/image serve d'open-proxy (SSRF + cache disque illimité).
 */
const ALLOWED_IMAGE_HOSTS = [
  // Supabase storage (si tu y stockes des images plus tard)
  "*.supabase.co",
  // Avatars Google (réponses Google Places, OAuth)
  "*.googleusercontent.com",
  // Stripe (parfois utilisé pour les visuels produits)
  "files.stripe.com",
];

/** En-têtes de sécurité appliqués à TOUTES les réponses. */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=(self)",
    ].join(", "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
