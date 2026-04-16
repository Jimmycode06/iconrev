"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Gift, Star, Zap } from "lucide-react";

export function CTASection() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.14),transparent_55%)]" />
        <div className="absolute -bottom-1/4 left-1/2 h-[70%] w-[120%] -translate-x-1/2 rounded-[100%] bg-white/[0.06] blur-3xl" />
      </div>

      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <Gift className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-semibold text-white">
              Limited offer: 20% off with code LAUNCH20
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight tracking-tight text-balance"
          >
            While you read this, competitors are collecting reviews
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            Every day without fresh reviews is a day Google ranks you lower.
            Order today — cards ship in 2–3 business days and start working
            immediately.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-10 text-white"
          >
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">$38,90</div>
              <div className="text-sm opacity-90">Starting at</div>
            </div>
            <div className="w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">2–3 days</div>
              <div className="text-sm opacity-90">Free shipping</div>
            </div>
            <div className="w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">30 days</div>
              <div className="text-sm opacity-90">Money-back guarantee</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 group font-bold"
              onClick={() => router.push("/products")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Order now — from $38,90
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/80"
          >
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              Money-back guarantee
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              30-second setup
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              Trusted by 1,247+ businesses
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
