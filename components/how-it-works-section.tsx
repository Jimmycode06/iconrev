"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

const steps = [
  {
    number: 1,
    imageSrc: "/steps/step-1.png",
    imageAlt: "Step 1 placeholder image",
    title: "Step 1: Scan the QR code",
    description:
      "When your stand arrives, scan the QR code to start the setup in seconds.",
  },
  {
    number: 2,
    imageSrc: "/steps/step-2.png",
    imageAlt: "Step 2 placeholder image",
    title: "Step 2: Activate your stand",
    description:
      "Open the setup flow, enter your activation details, and connect your Google review link.",
  },
  {
    number: 3,
    imageSrc: "/steps/step-3.png",
    imageAlt: "Step 3 placeholder image",
    title: "Step 3: Collect reviews daily",
    description:
      "That’s it. Your stand keeps generating reviews while your team focuses on service.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="pt-10 pb-20 md:pt-12 md:pb-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="inline-flex items-center gap-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
            <Timer className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
            Setup Your Stand in 3 Easy Steps
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            A clean setup flow your staff can explain in 10 seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="relative w-[116px] h-[116px] rounded-2xl overflow-hidden border border-border/80 bg-card shadow-sm">
                  <Image
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="116px"
                  />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-[52px] inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow">
                  {step.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight text-balance">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
