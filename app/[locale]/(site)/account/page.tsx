import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  HelpCircle,
  MapPin,
  ShieldCheck,
  SquareStack,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AccountAuthCard } from "@/components/account-auth-card";
import { AccountReviewReplyAssistant } from "@/components/account-review-reply-assistant";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CardRow = {
  id: string;
  review_url: string | null;
  business_name: string | null;
  business_address: string | null;
  activated_at: string | null;
  owner_email: string | null;
};

function formatDate(value: string | null, locale: string) {
  if (!value) return locale === "fr" ? "Non activée" : "Not activated";

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  const supabase = createClient();

  if (!supabase) {
    return (
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{t("setup_title")}</CardTitle>
              <CardDescription>{t("setup_desc")}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {t("login_title")}
            </h1>
            <p className="text-muted-foreground">{t("login_desc")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <AccountAuthCard />
          </div>
        </div>
      </section>
    );
  }

  const { data, error } = await supabase
    .from("cards")
    .select("id,review_url,business_name,business_address,activated_at,owner_email")
    .eq("owner_id", user.id)
    .order("activated_at", { ascending: false, nullsFirst: false });

  const cards = (data ?? []) as CardRow[];
  const activeCount = cards.filter((card) => card.review_url).length;

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 mb-2">
              {t("eyebrow")}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {t("desc")}
            </p>
          </div>
          <AccountSignOutButton label={t("sign_out")} />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t("total_cards")}</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <SquareStack className="h-6 w-6 text-blue-600" />
                {cards.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t("active_cards")}</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                {activeCount}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t("account_email")}</CardDescription>
              <CardTitle className="truncate text-base">
                {user.email ?? "—"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <AccountReviewReplyAssistant />

        {error ? (
          <Card className="border-red-100 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">{t("load_error")}</CardTitle>
              <CardDescription className="text-red-600">
                {error.message}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : cards.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("empty_title")}</CardTitle>
              <CardDescription>{t("empty_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={locale === "fr" ? "/fr/products" : "/products"}>
                  {t("empty_cta")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => {
              const isActive = Boolean(card.review_url);

              return (
                <Card key={card.id} className="overflow-hidden">
                  <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <CardTitle className="text-xl">
                          {card.business_name || t("unknown_business")}
                        </CardTitle>
                        <Badge
                          className={
                            isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }
                          variant="outline"
                        >
                          {isActive ? t("status_active") : t("status_pending")}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{card.business_address || t("no_address")}</span>
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground md:text-right">
                      <div className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(card.activated_at, locale)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 border-t bg-muted/20 pt-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">{t("card_id")}</span>{" "}
                      <span className="font-medium text-foreground">
                        {card.id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {card.review_url ? (
                        <Button asChild>
                          <a
                            href={card.review_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("test_link")}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : null}
                      <Button asChild variant="outline">
                        <Link href={locale === "fr" ? "/fr/contact" : "/contact"}>
                          {t("support")}
                          <HelpCircle className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
