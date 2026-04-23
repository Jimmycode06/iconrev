import { TrendingUpIcon, TrendingDownIcon, EuroIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import { AdminOrdersTable } from "@/components/admin-orders-table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  amount_total: number;
  currency: string;
};

type Order = {
  id: string;
  stripe_session_id: string;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  business_name: string | null;
  shipping_name: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  created_at: string;
  order_items: OrderItem[];
};

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";

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

  const { data: ordersData, error } = await supabase
    .from("orders")
    .select(
      "id,stripe_session_id,customer_email,amount_total,currency,payment_status,order_status,business_name,shipping_name,shipping_city,shipping_country,created_at,order_items(id,product_name,quantity,amount_total,currency)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isFr ? "Erreur de chargement" : "Error loading orders"}
            </CardTitle>
            <CardDescription className="text-destructive">
              {error.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const orders = (ordersData || []) as unknown as Order[];
  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const revenueCents = paidOrders.reduce((s, o) => s + (o.amount_total || 0), 0);
  const avgCents =
    paidOrders.length > 0 ? Math.round(revenueCents / paidOrders.length) : 0;
  const uniqueEmails = new Set(paidOrders.map((o) => o.customer_email).filter(Boolean)).size;

  return (
    <>
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {isFr ? "Commandes" : "Orders"}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

            {/* KPI Cards */}
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card lg:px-6">
              <Card className="@container/card">
                <CardHeader className="relative">
                  <CardDescription>
                    {isFr ? "Chiffre d'affaires" : "Revenue"}
                  </CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {formatPrice(revenueCents / 100, locale)}
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge
                      variant="outline"
                      className="flex gap-1 rounded-lg text-xs"
                    >
                      <EuroIcon className="size-3" />
                      EUR
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {isFr ? "Total paiements Stripe" : "Total Stripe payments"}
                    <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    {isFr
                      ? `Basé sur ${paidOrders.length} commandes payées`
                      : `Based on ${paidOrders.length} paid orders`}
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader className="relative">
                  <CardDescription>
                    {isFr ? "Commandes payées" : "Paid orders"}
                  </CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {paidOrders.length}
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge
                      variant="outline"
                      className="flex gap-1 rounded-lg text-xs"
                    >
                      <ShoppingBagIcon className="size-3" />
                      {isFr ? "Total" : "Total"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {isFr ? "Panier moyen" : "Average order"}
                    {avgCents > 0 ? (
                      <TrendingUpIcon className="size-4" />
                    ) : (
                      <TrendingDownIcon className="size-4" />
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {formatPrice(avgCents / 100, locale)}{" "}
                    {isFr ? "par commande" : "per order"}
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader className="relative">
                  <CardDescription>
                    {isFr ? "Clients uniques" : "Unique customers"}
                  </CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {uniqueEmails}
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge
                      variant="outline"
                      className="flex gap-1 rounded-lg text-xs"
                    >
                      <UsersIcon className="size-3" />
                      {isFr ? "Emails" : "Emails"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {isFr ? "Adresses email distinctes" : "Distinct email addresses"}
                  </div>
                  <div className="text-muted-foreground">
                    {isFr ? "Sur les 100 dernières commandes" : "From last 100 orders"}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Orders table */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isFr ? "Dernières commandes" : "Latest orders"}
                  </CardTitle>
                  <CardDescription>
                    {orders.length === 0
                      ? isFr
                        ? "Aucune commande enregistrée pour le moment."
                        : "No orders stored yet."
                      : isFr
                      ? `${orders.length} commandes au total`
                      : `${orders.length} orders total`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2">
                      <ShoppingBagIcon className="h-10 w-10 opacity-30" />
                      <p>
                        {isFr
                          ? "Les commandes payées via Stripe apparaîtront ici automatiquement."
                          : "Paid Stripe orders will appear here automatically."}
                      </p>
                    </div>
                  ) : (
                    <AdminOrdersTable
                      orders={orders as any}
                      locale={locale}
                      isFr={isFr}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
