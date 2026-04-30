import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3Icon,
  EuroIcon,
  MousePointerClickIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type AnalyticsEvent = {
  event_type: string;
  anonymous_id: string | null;
  session_id: string | null;
  path: string | null;
  created_at: string;
};

type Order = {
  amount_total: number;
  payment_status: string;
  created_at: string;
};

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isoDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function percent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(value >= 10 ? 1 : 2)}%`;
}

function metricDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const delta = ((current - previous) / previous) * 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

function inRange(dateValue: string, start: Date, end: Date) {
  const time = new Date(dateValue).getTime();
  return time >= start.getTime() && time < end.getTime();
}

function uniqueCount(values: Array<string | null>) {
  return new Set(values.filter(Boolean)).size;
}

function uniqueSessions(events: AnalyticsEvent[]) {
  const keys = events.map(
    (event) => event.session_id ?? event.anonymous_id ?? `event:${event.created_at}`
  );
  return new Set(keys).size;
}

export default async function AdminAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { locale } = await params;
  const { days: daysParam } = await searchParams;
  const isFr = locale === "fr";
  const days = daysParam === "7" || daysParam === "90" ? Number(daysParam) : 30;
  const now = new Date();
  const currentStart = startOfDay(new Date(now));
  currentStart.setDate(currentStart.getDate() - (days - 1));
  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - days);

  const supabase = createAdminClient();

  if (!supabase) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Setup required</CardTitle>
            <CardDescription>
              Missing <code>NEXT_PUBLIC_SUPABASE_URL</code> or{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code>.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const [eventsResult, ordersResult] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_type,anonymous_id,session_id,path,created_at")
      .gte("created_at", previousStart.toISOString())
      .order("created_at", { ascending: true })
      .limit(20000),
    supabase
      .from("orders")
      .select("amount_total,payment_status,created_at")
      .gte("created_at", previousStart.toISOString())
      .order("created_at", { ascending: true }),
  ]);

  const tableMissing =
    eventsResult.error?.message?.toLowerCase().includes("analytics_events") ??
    false;

  const events = ((eventsResult.data ?? []) as AnalyticsEvent[]).filter(
    (event) => event.event_type === "page_view"
  );
  const orders = ((ordersResult.data ?? []) as Order[]).filter(
    (order) => order.payment_status === "paid"
  );

  const currentEvents = events.filter((event) =>
    inRange(event.created_at, currentStart, now)
  );
  const previousEvents = events.filter((event) =>
    inRange(event.created_at, previousStart, currentStart)
  );
  const currentOrders = orders.filter((order) =>
    inRange(order.created_at, currentStart, now)
  );
  const previousOrders = orders.filter((order) =>
    inRange(order.created_at, previousStart, currentStart)
  );

  const pageViews = currentEvents.length;
  const previousPageViews = previousEvents.length;
  const visits = uniqueSessions(currentEvents);
  const previousVisits = uniqueSessions(previousEvents);
  const visitors = uniqueCount(currentEvents.map((event) => event.anonymous_id));
  const paidOrders = currentOrders.length;
  const previousPaidOrders = previousOrders.length;
  const revenueCents = currentOrders.reduce(
    (sum, order) => sum + (order.amount_total || 0),
    0
  );
  const previousRevenueCents = previousOrders.reduce(
    (sum, order) => sum + (order.amount_total || 0),
    0
  );
  const conversionRate = visits > 0 ? (paidOrders / visits) * 100 : 0;
  const previousConversionRate =
    previousVisits > 0 ? (previousPaidOrders / previousVisits) * 100 : 0;
  const averageOrderCents =
    paidOrders > 0 ? Math.round(revenueCents / paidOrders) : 0;

  const dayKeys = Array.from({ length: days }, (_, index) => {
    const date = new Date(currentStart);
    date.setDate(currentStart.getDate() + index);
    return isoDateKey(date);
  });

  const daily = dayKeys.map((key) => {
    const dayEvents = currentEvents.filter((event) =>
      event.created_at.startsWith(key)
    );
    const dayVisits = uniqueSessions(dayEvents);
    const dayPageViews = dayEvents.length;
    const dayOrders = currentOrders.filter((order) =>
      order.created_at.startsWith(key)
    ).length;
    return { key, visits: dayVisits, pageViews: dayPageViews, orders: dayOrders };
  });
  const maxDailyVisits = Math.max(1, ...daily.map((day) => day.visits));

  const topPages = Array.from(
    currentEvents.reduce((map, event) => {
      const path = event.path || "/";
      map.set(path, (map.get(path) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const ranges = [7, 30, 90];

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {isFr ? "Analyse de données" : "Analytics"}
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isFr ? "Performance du site" : "Site performance"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isFr
                ? "Visites uniques, pages vues, commandes et conversion calculées depuis les événements Iconrev."
                : "Unique visits, page views, orders and conversion calculated from Iconrev events."}
            </p>
          </div>
          <div className="flex gap-2">
            {ranges.map((range) => (
              <Badge
                key={range}
                variant={range === days ? "default" : "outline"}
                className="rounded-md px-3 py-1"
              >
                <Link href={`/${locale}/admin/analytics?days=${range}`}>
                  {range}j
                </Link>
              </Badge>
            ))}
          </div>
        </div>

        {tableMissing ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">
                {isFr
                  ? "Table analytics à créer"
                  : "Analytics table required"}
              </CardTitle>
              <CardDescription className="text-amber-700">
                {isFr
                  ? "Lance supabase/migration-analytics-events.sql dans Supabase SQL Editor pour commencer à collecter les visites."
                  : "Run supabase/migration-analytics-events.sql in Supabase SQL Editor to start collecting visits."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title={isFr ? "Visites" : "Visits"}
            value={visits.toLocaleString(isFr ? "fr-FR" : "en-US")}
            delta={metricDelta(visits, previousVisits)}
            icon={<MousePointerClickIcon className="h-5 w-5 text-blue-600" />}
            isFr={isFr}
          />
          <MetricCard
            title={isFr ? "Visiteurs uniques" : "Unique visitors"}
            value={visitors.toLocaleString(isFr ? "fr-FR" : "en-US")}
            delta={metricDelta(visitors, uniqueCount(previousEvents.map((e) => e.anonymous_id)))}
            icon={<UsersIcon className="h-5 w-5 text-cyan-600" />}
            isFr={isFr}
          />
          <MetricCard
            title={isFr ? "Taux de conversion" : "Conversion rate"}
            value={percent(conversionRate)}
            delta={metricDelta(conversionRate, previousConversionRate)}
            icon={<TrendingUpIcon className="h-5 w-5 text-emerald-600" />}
            isFr={isFr}
          />
          <MetricCard
            title={isFr ? "Chiffre d'affaires" : "Revenue"}
            value={formatPrice(revenueCents / 100, locale)}
            delta={metricDelta(revenueCents, previousRevenueCents)}
            icon={<EuroIcon className="h-5 w-5 text-amber-600" />}
            isFr={isFr}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title={isFr ? "Commandes payées" : "Paid orders"}
            value={paidOrders.toLocaleString(isFr ? "fr-FR" : "en-US")}
            delta={metricDelta(paidOrders, previousPaidOrders)}
            icon={<ShoppingBagIcon className="h-5 w-5 text-violet-600" />}
            isFr={isFr}
          />
          <MetricCard
            title={isFr ? "Panier moyen" : "Average order"}
            value={formatPrice(averageOrderCents / 100, locale)}
            delta={null}
            icon={<EuroIcon className="h-5 w-5 text-green-600" />}
            isFr={isFr}
          />
          <MetricCard
            title={isFr ? "Pages vues" : "Page views"}
            value={pageViews.toLocaleString(isFr ? "fr-FR" : "en-US")}
            delta={metricDelta(pageViews, previousPageViews)}
            icon={<BarChart3Icon className="h-5 w-5 text-slate-600" />}
            isFr={isFr}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                {isFr ? "Visites par jour" : "Visits by day"}
              </CardTitle>
              <CardDescription>
                {isFr
                  ? "Vue simple sur la période sélectionnée."
                  : "Simple view for the selected period."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-end gap-1">
                {daily.map((day) => (
                  <div
                    key={day.key}
                    className="group flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative flex w-full items-end justify-center">
                      <div
                        className="w-full max-w-6 rounded-t-md bg-blue-500/80 transition-colors group-hover:bg-blue-600"
                        style={{
                          height: `${Math.max(
                            day.visits === 0 ? 2 : 8,
                            (day.visits / maxDailyVisits) * 210
                          )}px`,
                        }}
                        title={`${day.key}: ${day.visits} visits, ${day.pageViews} page views, ${day.orders} orders`}
                      />
                    </div>
                    {days <= 30 ? (
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(day.key).getDate()}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isFr ? "Pages vues" : "Top pages"}</CardTitle>
              <CardDescription>
                {isFr
                  ? "Les pages les plus consultées."
                  : "Most viewed pages."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {isFr
                    ? "Pas encore de visites collectées."
                    : "No visits collected yet."}
                </p>
              ) : (
                topPages.map(([path, count]) => (
                  <div key={path} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium">{path}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${Math.max(8, (count / Math.max(1, pageViews)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function MetricCard({
  title,
  value,
  delta,
  icon,
  isFr,
}: {
  title: string;
  value: string;
  delta: string | null;
  icon: ReactNode;
  isFr: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{title}</CardDescription>
          {icon}
        </div>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        {delta ? (
          <p className="text-xs text-muted-foreground">
            <span
              className={
                delta.startsWith("-") ? "text-red-600" : "text-emerald-600"
              }
            >
              {delta}
            </span>{" "}
            {isFr ? "vs période précédente" : "vs previous period"}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {isFr ? "Période sélectionnée" : "Selected period"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
