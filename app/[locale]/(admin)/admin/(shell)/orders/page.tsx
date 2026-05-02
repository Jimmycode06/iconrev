import { ClipboardListIcon, PackageCheckIcon, ShoppingBagIcon } from "lucide-react";
import { AdminOrdersTable } from "@/components/admin-orders-table";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";

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
  order_number: number | null;
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
  tracking_number: string | null;
  shipping_carrier: string | null;
  tracking_url: string | null;
  fulfilled_at: string | null;
  created_at: string;
  order_items: OrderItem[];
};

function startOfTodayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

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
      "id,order_number,stripe_session_id,customer_email,amount_total,currency,payment_status,order_status,business_name,shipping_name,shipping_city,shipping_country,tracking_number,shipping_carrier,tracking_url,fulfilled_at,created_at,order_items(id,product_name,quantity,amount_total,currency)"
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

  const todayStart = startOfTodayISO();
  const todayOrders = orders.filter((o) => o.created_at >= todayStart);
  const todayFulfilled = todayOrders.filter(
    (o) => o.order_status === "fulfilled"
  );

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

            {/* KPI Cards (today only) */}
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="@container/card">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <ClipboardListIcon className="h-3.5 w-3.5" />
                      {isFr ? "Commandes (aujourd'hui)" : "Orders (today)"}
                    </CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums">
                      {todayOrders.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {isFr
                      ? "Toutes commandes reçues depuis 00:00"
                      : "All orders received since midnight"}
                  </CardContent>
                </Card>

                <Card className="@container/card">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <PackageCheckIcon className="h-3.5 w-3.5" />
                      {isFr
                        ? "Commandes traitées (aujourd'hui)"
                        : "Fulfilled orders (today)"}
                    </CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums">
                      {todayFulfilled.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {isFr
                      ? "Commandes marquées comme traitées aujourd'hui"
                      : "Orders marked as fulfilled today"}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Orders table */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isFr ? "Toutes les commandes" : "All orders"}
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
