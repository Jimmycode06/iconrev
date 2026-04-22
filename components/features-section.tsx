"use client";

import { motion } from "framer-motion";
import { Zap, Award, Smartphone, TrendingUp, Clock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("Features");

  const features = [
    {
      icon: TrendingUp,
      title: t("f1_title"),
      description: t("f1_desc"),
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      icon: Smartphone,
      title: t("f2_title"),
      description: t("f2_desc"),
      color: "from-indigo-500 to-indigo-600",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: t("f3_title"),
      description: t("f3_desc"),
      color: "from-cyan-500 to-blue-600",
      delay: 0.2,
    },
    {
      icon: Clock,
      title: t("f4_title"),
      description: t("f4_desc"),
      color: "from-emerald-500 to-emerald-600",
      delay: 0.3,
    },
    {
      icon: Award,
      title: t("f5_title"),
      description: t("f5_desc"),
      color: "from-violet-500 to-violet-600",
      delay: 0.4,
    },
    {
      icon: ShieldCheck,
      title: t("f6_title"),
      description: t("f6_desc"),
      color: "from-blue-600 to-blue-700",
      delay: 0.5,
    },
  ];

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
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            {t("subtitle")}
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
