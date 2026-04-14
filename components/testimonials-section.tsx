"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Thomas R.",
    role: "Restaurant owner",
    location: "Denver, CO",
    avatar: "T",
    color: "from-rose-500 to-orange-500",
    quote:
      "Before Iconrev I had 12 reviews in three years. Six weeks with the card: 48 new ones. I went from 8th to 2nd on Google Maps. Revenue was up about 25% the next month.",
    stars: 5,
    metric: "+400% reviews",
  },
  {
    name: "Sophie L.",
    role: "Spa owner",
    location: "Miami, FL",
    avatar: "S",
    color: "from-violet-500 to-purple-600",
    quote:
      "Guests love it. They scan on the way out and leave a review on the spot. I stopped chasing people. In three months: 91 new reviews and our rating went from 4.2 to 4.8.",
    stars: 5,
    metric: "4.2 → 4.8 stars",
  },
  {
    name: "Karim B.",
    role: "Independent auto shop",
    location: "Phoenix, AZ",
    avatar: "K",
    color: "from-emerald-500 to-teal-600",
    quote:
      "I thought Google reviews were mostly for restaurants. For a shop it might be even bigger. Competitors had ~15 reviews; I am at 67. People find me first and trust me faster.",
    stars: 5,
    metric: "8 → 67 reviews",
  },
  {
    name: "Julie M.",
    role: "Bakery owner",
    location: "Portland, OR",
    avatar: "J",
    color: "from-amber-500 to-orange-600",
    quote:
      "The card has sat on the counter for four months: 112 Google reviews, highest rating in the neighborhood, and tourists who say they found us on Maps. Paid for itself in a week.",
    stars: 5,
    metric: "112 in 4 months",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
            Real results
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
            1,200+ businesses trust Iconrev
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Restaurants, salons, shops, trades — same pattern: more reviews,
            more foot traffic, more revenue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((t, i) => (
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
                      className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-tight">
                        {t.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t.role}, {t.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {t.metric}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <div className="relative flex-1">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-blue-100" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                    {t.quote}
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
          {[
            { value: "4.9/5", label: "Average rating" },
            { value: "+300%", label: "Typical review lift" },
            { value: "< 30s", label: "Time to leave a review" },
            { value: "97%", label: "Customer satisfaction" },
          ].map((s, i) => (
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
