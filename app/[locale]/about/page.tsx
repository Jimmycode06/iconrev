"use client";

import { motion } from "framer-motion";
import {
  Target,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconrevLogo } from "@/components/iconrev-logo";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const router = useRouter();
  const t = useTranslations("About");

  const values = [
    {
      icon: Target,
      title: t("v1_title"),
      description: t("v1_desc"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      title: t("v2_title"),
      description: t("v2_desc"),
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: Award,
      title: t("v3_title"),
      description: t("v3_desc"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const stats = [
    { value: t("stat1_value"), label: t("stat1_label") },
    { value: t("stat2_value"), label: t("stat2_label") },
    { value: t("stat3_value"), label: t("stat3_label") },
    { value: t("stat4_value"), label: t("stat4_label") },
    { value: t("stat5_value"), label: t("stat5_label") },
    { value: t("stat6_value"), label: t("stat6_label") },
  ];

  const quotes = [t("q1"), t("q2"), t("q3"), t("q4")];

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
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t("subtitle")}
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-16">
          <Card>
            <CardContent className="p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">
                {t("story_title")}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {t("story_p1").split(t("story_p1_strong"))[0]}
                <strong className="text-foreground">
                  {t("story_p1_strong")}
                </strong>
                {t("story_p1").split(t("story_p1_strong"))[1]}
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {t("story_p2").split(t("story_p2_strong"))[0]}
                <strong className="text-foreground">
                  {t("story_p2_strong")}
                </strong>
                {t("story_p2").split(t("story_p2_strong"))[1]}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("story_p3_prefix")}{" "}
                <strong className="text-foreground">
                  {t("story_p3_strong")}
                </strong>{" "}
                {t("story_p3_suffix")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((item, index) => (
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
              {t("stats_title")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center mb-8">
              {stats.map((stat, index) => (
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
                {t("quotes_title")}
              </h2>
              <div className="space-y-4">
                {quotes.map((quote, i) => (
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
                  {t("cta")}
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
