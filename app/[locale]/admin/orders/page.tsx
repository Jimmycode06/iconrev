import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard setup required</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Missing `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: ordersData, error } = await supabase
    .from("orders")
    .select(
      "id,stripe_session_id,customer_email,amount_total,currency,payment_status,order_status,business_name,shipping_name,shipping_country,created_at,order_items(id,product_name,quantity,amount_total,currency)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Unable to load orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = (ordersData || []) as unknown as Order[];
  const paidOrders = orders.filter((order) => order.payment_status === "paid");
  const revenueCents = paidOrders.reduce(
    (sum, order) => sum + (order.amount_total || 0),
    0
  );
  const avgOrderCents =
    paidOrders.length > 0 ? Math.round(revenueCents / paidOrders.length) : 0;

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Admin
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {isFr ? "Commandes" : "Orders"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isFr
            ? "Vue rapide des paiements Stripe synchronises dans Supabase."
            : "Quick view of Stripe payments synced into Supabase."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label={isFr ? "Chiffre d'affaires" : "Revenue"}
          value={formatPrice(revenueCents / 100, locale)}
        />
        <StatCard
          label={isFr ? "Commandes payees" : "Paid orders"}
          value={String(paidOrders.length)}
        />
        <StatCard
          label={isFr ? "Panier moyen" : "Average order"}
          value={formatPrice(avgOrderCents / 100, locale)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isFr ? "Dernieres commandes" : "Latest orders"} ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isFr
                ? "Aucune commande enregistree pour le moment."
                : "No orders stored yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 pr-4">{isFr ? "Date" : "Date"}</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">{isFr ? "Business" : "Business"}</th>
                    <th className="py-3 pr-4">{isFr ? "Montant" : "Amount"}</th>
                    <th className="py-3 pr-4">{isFr ? "Paiement" : "Payment"}</th>
                    <th className="py-3 pr-4">{isFr ? "Pays" : "Country"}</th>
                    <th className="py-3">{isFr ? "Produits" : "Items"}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b align-top">
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleString(
                          isFr ? "fr-FR" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="py-3 pr-4">{order.customer_email || "—"}</td>
                      <td className="py-3 pr-4">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {order.business_name || order.shipping_name || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {order.stripe_session_id}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold">
                        {formatPrice(
                          (order.amount_total || 0) / 100,
                          locale === "fr" ? "fr" : "en"
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge value={order.payment_status} />
                      </td>
                      <td className="py-3 pr-4">{order.shipping_country || "—"}</td>
                      <td className="py-3">
                        <ul className="space-y-1">
                          {order.order_items?.map((item) => (
                            <li key={item.id} className="text-xs">
                              {item.quantity}x {item.product_name}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value?.toLowerCase() || "unknown";
  if (normalized === "paid") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        paid
      </Badge>
    );
  }
  if (normalized === "unpaid") {
    return <Badge variant="secondary">unpaid</Badge>;
  }
  return <Badge variant="outline">{normalized}</Badge>;
}

