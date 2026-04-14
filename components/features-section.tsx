"use client";

import { motion } from "framer-motion";
import { Zap, Award, Smartphone, TrendingUp, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "3× more reviews on average",
    description:
      "Most teams go from a handful of reviews to dozens in weeks. Each review moves you closer to the Google Maps top three — where most local clicks happen.",
    color: "from-blue-500 to-blue-600",
    delay: 0,
  },
  {
    icon: Smartphone,
    title: "Zero friction for customers",
    description:
      "No app, no account, no hunting for your listing. One tap or scan lands them on your review screen. Many businesses see review conversion jump from ~2% to ~30%.",
    color: "from-indigo-500 to-indigo-600",
    delay: 0.1,
  },
  {
    icon: Zap,
    title: "NFC + QR in one card",
    description:
      "Tap with a phone or scan the QR — both work. iPhone and Android. No customer left behind, no excuse not to leave a review.",
    color: "from-cyan-500 to-blue-600",
    delay: 0.2,
  },
  {
    icon: Clock,
    title: "Pays for itself fast",
    description:
      "One new customer from better visibility can cover the card. Many teams see strong ROI in the first month.",
    color: "from-emerald-500 to-emerald-600",
    delay: 0.3,
  },
  {
    icon: Award,
    title: "Premium look customers trust",
    description:
      "No more homemade signs. A polished card matches your brand and makes leaving a review feel natural.",
    color: "from-violet-500 to-violet-600",
    delay: 0.4,
  },
  {
    icon: ShieldCheck,
    title: "30-day money-back guarantee",
    description:
      "Try it risk-free. If you are not seeing momentum in the first month, we refund you — no hassle.",
    color: "from-blue-600 to-blue-700",
    delay: 0.5,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-24 bg-muted/50 border-y border-border/60">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
            Why Iconrev
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Everything you need to win local search on Google
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            No complicated software, no hidden subscription. One physical card
            working for you around the clock.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="h-full p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 rounded-bl-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
