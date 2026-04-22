"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations("Testimonials");

  const testimonials = [
    {
      name: t("t1_name"),
      role: t("t1_role"),
      location: t("t1_location"),
      avatar: "T",
      color: "from-rose-500 to-orange-500",
      quote: t("t1_quote"),
      stars: 5,
      metric: t("t1_metric"),
    },
    {
      name: t("t2_name"),
      role: t("t2_role"),
      location: t("t2_location"),
      avatar: "S",
      color: "from-violet-500 to-purple-600",
      quote: t("t2_quote"),
      stars: 5,
      metric: t("t2_metric"),
    },
    {
      name: t("t3_name"),
      role: t("t3_role"),
      location: t("t3_location"),
      avatar: "K",
      color: "from-emerald-500 to-teal-600",
      quote: t("t3_quote"),
      stars: 5,
      metric: t("t3_metric"),
    },
    {
      name: t("t4_name"),
      role: t("t4_role"),
      location: t("t4_location"),
      avatar: "J",
      color: "from-amber-500 to-orange-600",
      quote: t("t4_quote"),
      stars: 5,
      metric: t("t4_metric"),
    },
  ];

  const stats = [
    { value: t("stat1_value"), label: t("stat1_label") },
    { value: t("stat2_value"), label: t("stat2_label") },
    { value: t("stat3_value"), label: t("stat3_label") },
    { value: t("stat4_value"), label: t("stat4_label") },
  ];

  return (
    <section className="py-20 md:py-24 bg-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="h-full rounded-2xl border border-border/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-tight">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.role}, {item.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {item.metric}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(item.stars)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <div className="relative flex-1">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-blue-100" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                    {item.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-center"
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
