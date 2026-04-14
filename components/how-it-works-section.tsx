"use client";

import { motion } from "framer-motion";
import { Smartphone, Star, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Smartphone,
    title: "Place the card",
    description:
      "Put your Iconrev card on the counter, table, or checkout. No technical setup: we link it to your Google review flow after you order.",
    detail: "30-second placement",
    color: "bg-blue-600",
  },
  {
    number: "2",
    icon: Star,
    title: "Customer taps or scans",
    description:
      "A happy customer taps (NFC) or scans the QR. They land on your Google review screen — no app, no account.",
    detail: "Works on every smartphone",
    color: "bg-indigo-600",
  },
  {
    number: "3",
    icon: TrendingUp,
    title: "You climb in Maps",
    description:
      "Each new review lifts local ranking. More reviews, stronger rating, more visibility — more people choosing you.",
    detail: "Top 3 in weeks for many teams",
    color: "bg-cyan-600",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
            Dead simple
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Three steps to fill your Google Maps with five-star reviews
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            No training deck, no clunky tools. Your card does the work while you
            run the business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`relative w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <step.icon className="h-9 w-9 text-white" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-white text-foreground border-2 border-border rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {step.number}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3 max-w-xs mx-auto">
                {step.description}
              </p>
              <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {step.detail}
              </span>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-[4.5rem] h-5 w-5 text-muted-foreground/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
