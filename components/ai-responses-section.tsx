"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, MessageSquare, Zap, CheckCircle, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AIResponsesSection() {
  const router = useRouter();
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-background to-blue-50/60">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <Bot className="mr-2 h-4 w-4" />
            Coming soon — join the waitlist
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent text-balance">
            Never leave a Google review unanswered again
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Google rewards businesses that reply to reviews. Our AI drafts replies for you — 24/7,
            on-brand, in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Simple as 1-2-3-4
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">A customer leaves a review</h4>
                      <p className="text-sm text-muted-foreground">
                        Positive or negative — we detect new reviews on your Google Business Profile
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">AI reads sentiment &amp; context</h4>
                      <p className="text-sm text-muted-foreground">
                        Tone, topic, and nuance — thrilled, disappointed, or mixed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Personalized reply drafted</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional and warm, tuned to your industry — never copy-paste generic
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Post automatically (or approve first)</h4>
                      <p className="text-sm text-muted-foreground">
                        Full autopilot or one-click approval before anything goes live
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-2 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                  Why it matters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Google rewards active owners</h4>
                      <p className="text-sm text-muted-foreground">
                        Businesses that reply often rank higher in local results — often cited around +15% lift
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Save hours every week</h4>
                      <p className="text-sm text-muted-foreground">
                        Stop staring at a blank box. Drafts appear in about 10 seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Defuse negative reviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Fast, empathetic replies turn unhappy customers into loyal ones in many cases
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Replies while you sleep</h4>
                      <p className="text-sm text-muted-foreground">
                        Weekends, holidays, 3 a.m. — your reputation does not clock out
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Show you are listening</h4>
                      <p className="text-sm text-muted-foreground">
                        Most consumers trust businesses that respond to reviews
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-2">See the difference</h3>
          <p className="text-center text-muted-foreground mb-8">Replies that sound like you wrote them</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  5-star review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Customer:</p>
                  <p className="italic mb-3 text-sm">
                    &quot;Amazing spot! Friendly staff and the food was incredible. We&apos;ll be back!&quot;
                  </p>
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-green-700 mb-2 uppercase tracking-wider">AI draft — ~8 seconds:</p>
                    <p className="text-sm leading-relaxed">
                      &quot;Thank you so much — this means the world to our team! We&apos;re thrilled you enjoyed your visit and we can&apos;t wait to welcome you back soon.&quot;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  2-star review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Customer:</p>
                  <p className="italic mb-3 text-sm">
                    &quot;Waited 30 minutes for my order. Really disappointing.&quot;
                  </p>
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-orange-700 mb-2 uppercase tracking-wider">AI draft — empathetic tone:</p>
                    <p className="text-sm leading-relaxed">
                      &quot;We&apos;re sorry this wait missed the experience we aim for. That&apos;s not the standard we hold ourselves to. Please message us directly so we can make it right — we&apos;d love another chance to earn your trust.&quot;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white border-0 shadow-xl shadow-blue-600/20">
            <CardContent className="p-8 md:p-10">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-95" />
              <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                Get early access
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                AI review replies are on the way. Join the waitlist now and get{" "}
                <strong>3 months free</strong> as a beta partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold group"
                  onClick={() => router.push("/contact")}
                >
                  Reserve my spot
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-white/70">
                Limited spots — no commitment, no card required
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
