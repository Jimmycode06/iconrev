"use client";

import { useMemo, useState } from "react";
import { Bot, Copy, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Tone = "warm" | "pro";

function buildReply({
  reviewText,
  tone,
  businessName,
  isFr,
}: {
  reviewText: string;
  tone: Tone;
  businessName: string;
  isFr: boolean;
}) {
  const lower = reviewText.toLowerCase();
  const isNegative =
    /(probl|mauvais|nul|horrible|déçu|decu|retard|scam|arnaque|bad|poor|awful|disappoint|issue|problem|late)/i.test(
      lower
    );

  const words = reviewText
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  const firstWords = words.slice(0, 18).join(" ");
  const snippet = firstWords.length === 0 ? null : `${firstWords}${words.length > 18 ? "…" : ""}`;

  if (isFr) {
    if (isNegative) {
      return `Bonjour,\n\nMerci d'avoir pris le temps de partager votre retour. Nous sommes sincèrement désolés pour cette expérience.\n\nNous prenons votre message très au sérieux${snippet ? ` ("${snippet}")` : ""} et nous voulons corriger la situation rapidement. Pouvez-vous nous écrire à contact@iconrev.com avec plus de détails ?\n\nMerci encore,\n${businessName}`;
    }

    if (tone === "warm") {
      return `Bonjour,\n\nUn grand merci pour votre avis${snippet ? ` et pour vos mots sur "${snippet}"` : ""}. Ça fait vraiment plaisir à toute l'équipe.\n\nNous sommes ravis de vous avoir accueilli et espérons vous revoir très bientôt.\n\nÀ très vite,\n${businessName}`;
    }

    return `Bonjour,\n\nMerci pour votre avis${snippet ? ` et votre retour sur "${snippet}"` : ""}.\n\nVotre confiance nous encourage à maintenir ce niveau de qualité au quotidien. Nous serons heureux de vous accueillir à nouveau.\n\nCordialement,\n${businessName}`;
  }

  if (isNegative) {
    return `Hi,\n\nThank you for taking the time to share your feedback. We're truly sorry this experience did not meet your expectations.\n\nWe take your message seriously${snippet ? ` ("${snippet}")` : ""} and want to resolve this quickly. Please contact us at contact@iconrev.com with more details so we can help.\n\nThank you,\n${businessName}`;
  }

  if (tone === "warm") {
    return `Hi,\n\nThank you so much for your review${snippet ? ` and for mentioning "${snippet}"` : ""}. It means a lot to our whole team.\n\nWe're glad you had a great experience and hope to welcome you again soon.\n\nBest,\n${businessName}`;
  }

  return `Hi,\n\nThank you for your review${snippet ? ` and your feedback about "${snippet}"` : ""}.\n\nYour trust motivates us to keep delivering a high standard every day. We look forward to serving you again.\n\nKind regards,\n${businessName}`;
}

export function AccountReviewReplyAssistant() {
  const t = useTranslations("Account");
  const [reviewText, setReviewText] = useState("");
  const [tone, setTone] = useState<Tone>("warm");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [copied, setCopied] = useState(false);

  const isFr = useMemo(() => t("assistant_lang") === "fr", [t]);
  const canGenerate = reviewText.trim().length >= 12;

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setCopied(false);
    await new Promise((resolve) => setTimeout(resolve, 450));

    setReply(
      buildReply({
        reviewText,
        tone,
        businessName: isFr ? "L'équipe" : "The team",
        isFr,
      })
    );
    setLoading(false);
  }

  async function handleCopy() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  }

  return (
    <Card className="mb-8 border border-blue-100/80 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10">
              <Bot className="h-4 w-4 text-blue-600" />
            </span>
            {t("assistant_title")}
          </CardTitle>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            {t("assistant_note")}
          </Badge>
        </div>
        <CardDescription className="pt-1">{t("assistant_desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-white/90 p-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              {t("assistant_tone_label")}
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={tone === "warm" ? "default" : "outline"}
                onClick={() => setTone("warm")}
              >
                {t("assistant_tone_warm")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={tone === "pro" ? "default" : "outline"}
                onClick={() => setTone("pro")}
              >
                {t("assistant_tone_pro")}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t("assistant_input_label")}
            </label>
            <Textarea
              className="min-h-[170px]"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t("assistant_input_placeholder")}
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {reviewText.trim().length}/500
              </p>
              <Button type="button" onClick={handleGenerate} disabled={!canGenerate || loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {t("assistant_generate")}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                {t("assistant_output_label")}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopy}
                disabled={!reply}
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                {copied ? t("assistant_copied") : t("assistant_copy")}
              </Button>
            </div>
            <Separator className="mb-3" />
            <p className="min-h-[170px] whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {reply || t("assistant_output_placeholder")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
