"use client";

import { motion } from "framer-motion";
import { Target, Users, Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconrevLogo } from "@/components/iconrev-logo";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <IconrevLogo size="md" showTagline />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-balance">
            We built the product we wished we had for our own business
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Iconrev started with a simple frustration: why is it so hard to turn
            happy customers into Google reviews?
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-16">
          <Card>
            <CardContent className="p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Our story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                In 2023, after years running a local restaurant, our founder saw
                the same pattern:{" "}
                <strong className="text-foreground">
                  guests loved the place, but only about 2% left a review
                </strong>
                . Why? The path was too long — open Maps, find the business, hunt
                for the review button. Most people give up.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The fix was obvious:{" "}
                <strong className="text-foreground">remove the friction</strong>. One
                card on the counter. Tap or scan. Land straight on the review
                screen. For many teams, that turned ~2% into ~28% completion.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, <strong className="text-foreground">1,200+ businesses</strong>{" "}
                use Iconrev — restaurants, salons, shops, trades. Same outcome:
                more reviews, stronger ratings, better Maps visibility, more
                customers. Our mission: help every local business compete on Google
                like the big brands.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Target,
              title: "Own local visibility",
              description:
                "Roughly three in four people never scroll past the top three on Maps. We help you get there.",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Users,
              title: "Zero friction, zero training",
              description:
                "No customer app, no staff workshop. If you can place a card on a counter, you can use Iconrev.",
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              icon: Award,
              title: "ROI that shows up fast",
              description:
                "One new customer from better visibility can pay for the card. Many teams see strong payback in the first month.",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`h-16 w-16 rounded-2xl ${item.bg} flex items-center justify-center`}
                    >
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white mb-16">
          <CardContent className="p-8 md:p-10">
            <h2 className="text-3xl font-bold mb-6 text-center tracking-tight">
              By the numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center mb-8">
              {[
                { value: "1,247+", label: "Businesses equipped" },
                { value: "+300%", label: "Typical review lift" },
                { value: "4.9/5", label: "Satisfaction" },
                { value: "< 30s", label: "To leave a review" },
                { value: "15×", label: "Avg. first-month ROI (reported)" },
                { value: "97%", label: "Would recommend Iconrev" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-extrabold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-blue-100">
            <CardContent className="p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">
                What we hear most from customers
              </h2>
              <div className="space-y-4">
                {[
                  "I didn’t think reviews could move revenue this much.",
                  "In six weeks I had more reviews than my competitor who’s been there ten years.",
                  "The hardest part was trying it once. After that it runs itself.",
                  "The card paid for itself in the first week.",
                ].map((quote, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground italic leading-relaxed">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold group"
                  onClick={() => router.push("/products")}
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Join 1,247+ businesses
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
