import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  ExternalLink,
  HelpCircle,
  LayoutGrid,
  MapPin,
  Mail,
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
  const isFr = locale === "fr";
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
  const pendingCount = cards.length - activeCount;
  const latestCard = cards[0];
  const sectionTitle = isFr ? "Vos plaques" : "Your plates";
  const sectionDesc = isFr
    ? "Consultez l'état de chaque plaque et ouvrez rapidement son lien d'avis."
    : "Review each plate status and quickly open its review link.";
  const baseAccountPath = isFr ? "/fr/account" : "/account";

  return (
    <section className="py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        <SidebarProvider className="has-[[data-variant=inset]]:!bg-transparent">
          <Sidebar
            variant="inset"
            collapsible="offcanvas"
            className="top-28 h-[calc(100svh-7rem)]"
          >
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                    <Link href={baseAccountPath}>
                      <LayoutGrid className="h-5 w-5 text-foreground" />
                      <span className="text-base font-semibold">{isFr ? "Iconrev Compte" : "Iconrev Account"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{isFr ? "Navigation" : "Navigation"}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={`${baseAccountPath}#overview`}>
                          <LayoutGrid className="h-4 w-4" />
                          <span>{isFr ? "Vue d'ensemble" : "Overview"}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={`${baseAccountPath}#ai-agent`}>
                          <Bot className="h-4 w-4" />
                          <span>{isFr ? "Agent IA" : "AI Agent"}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="!bg-transparent md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-border/60 md:peer-data-[variant=inset]:shadow-sm">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b">
              <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">{t("title")}</h1>
              </div>
            </header>

            <div id="overview" className="flex flex-1 flex-col gap-6 p-4 md:p-6">
              <Card className="overflow-hidden border border-blue-100/70 bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/40">
                <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground mb-2">
                      {t("eyebrow")}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {t("title")}
                    </h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl">{t("desc")}</p>
                  </div>
                  <div className="space-y-3 md:text-right">
                    <AccountSignOutButton label={t("sign_out")} />
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email ?? "—"}
                    </p>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-4">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardDescription>{t("total_cards")}</CardDescription>
                    <CardTitle className="flex items-center gap-2 text-3xl">
                      <LayoutGrid className="h-6 w-6 text-blue-600" />
                      {cards.length}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>{t("active_cards")}</CardDescription>
                    <CardTitle className="flex items-center gap-2 text-3xl">
                      <ShieldCheck className="h-6 w-6 text-foreground" />
                      {activeCount}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>{isFr ? "En attente" : "Pending"}</CardDescription>
                    <CardTitle className="flex items-center gap-2 text-3xl">
                      <SquareStack className="h-6 w-6 text-amber-600" />
                      {pendingCount}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {latestCard ? (
                <Card className="border-dashed">
                  <CardHeader className="pb-4">
                    <CardDescription>{isFr ? "Dernière plaque activée" : "Latest activated plate"}</CardDescription>
                    <CardTitle className="text-lg">
                      {latestCard.business_name || t("unknown_business")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(latestCard.activated_at, locale)}
                    </p>
                    {latestCard.review_url ? (
                      <Button asChild size="sm" className="sm:self-auto self-start">
                        <a href={latestCard.review_url} target="_blank" rel="noopener noreferrer">
                          {isFr ? "Ouvrir le lien d'avis" : "Open review link"}
                          <ArrowUpRight className="ml-1.5 h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              <div id="ai-agent">
                <AccountReviewReplyAssistant />
              </div>

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
                <Card className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-xl">{sectionTitle}</CardTitle>
                    <CardDescription>{sectionDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {cards.map((card) => {
                        const isActive = Boolean(card.review_url);

                        return (
                          <div key={card.id} className="p-4 md:p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg text-foreground">
                                    {card.business_name || t("unknown_business")}
                                  </h3>
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
                                <p className="text-sm text-muted-foreground flex items-start gap-2">
                                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                  <span>{card.business_address || t("no_address")}</span>
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {t("card_id")}{" "}
                                  <span className="font-medium text-foreground">{card.id}</span>
                                </p>
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row md:flex-col md:items-end">
                                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  {formatDate(card.activated_at, locale)}
                                </p>
                                <div className="flex gap-2">
                                  {card.review_url ? (
                                    <Button asChild size="sm">
                                      <a
                                        href={card.review_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {t("test_link")}
                                        <ExternalLink className="ml-1.5 h-4 w-4" />
                                      </a>
                                    </Button>
                                  ) : null}
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={locale === "fr" ? "/fr/contact" : "/contact"}>
                                      {t("support")}
                                      <HelpCircle className="ml-1.5 h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </section>
  );
}
