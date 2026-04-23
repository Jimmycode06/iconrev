import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  MapPinIcon,
  BuildingIcon,
  PackageIcon,
  CreditCardIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_amount: number;
  amount_total: number;
  currency: string;
};

type Order = {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  business_name: string | null;
  business_address: string | null;
  shipping_name: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  created_at: string;
  order_items: OrderItem[];
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isFr = locale === "fr";

  const supabase = createAdminClient();
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,stripe_session_id,stripe_payment_intent_id,customer_email,amount_total,currency,payment_status,order_status,business_name,business_address,shipping_name,shipping_line1,shipping_line2,shipping_city,shipping_state,shipping_postal_code,shipping_country,created_at,order_items(id,product_name,quantity,unit_amount,amount_total,currency)"
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const order = data as unknown as Order;
  const locale_ = isFr ? "fr-FR" : "en-US";

  const shippingLines = [
    order.shipping_name,
    order.shipping_line1,
    order.shipping_line2,
    [order.shipping_city, order.shipping_state, order.shipping_postal_code]
      .filter(Boolean)
      .join(", "),
    order.shipping_country,
  ].filter(Boolean);

  return (
    <>
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Link
            href={`/${locale}/admin/orders`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            {isFr ? "Commandes" : "Orders"}
          </Link>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <span className="text-sm font-medium font-mono text-muted-foreground truncate max-w-[200px]">
            {order.stripe_session_id}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Top row: status + date */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isFr ? "Détail de la commande" : "Order details"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date(order.created_at).toLocaleString(locale_, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                order.payment_status === "paid"
                  ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 px-3 py-1"
                  : "px-3 py-1"
              }
              variant="outline"
            >
              {order.payment_status}
            </Badge>
            <span className="text-xl font-bold tabular-nums">
              {formatPrice((order.amount_total || 0) / 100, locale)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Customer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {isFr ? "Client" : "Customer"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.customer_email || "—"}</p>
              {order.stripe_payment_intent_id && (
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {order.stripe_payment_intent_id}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                {isFr ? "Adresse d'expédition" : "Shipping address"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {shippingLines.length > 0 ? (
                <div className="space-y-0.5">
                  {shippingLines.map((line, i) => (
                    <p key={i} className={i === 0 ? "font-medium" : "text-muted-foreground"}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>

          {/* Business */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                {isFr ? "Établissement" : "Business"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-0.5">
              {order.business_name ? (
                <>
                  <p className="font-medium">{order.business_name}</p>
                  {order.business_address && (
                    <p className="text-muted-foreground">{order.business_address}</p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
              {isFr ? "Articles commandés" : "Items ordered"}
            </CardTitle>
            <CardDescription>
              {order.order_items?.length ?? 0}{" "}
              {isFr ? "article(s)" : "item(s)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isFr ? "Produit" : "Product"}</TableHead>
                  <TableHead className="text-right">
                    {isFr ? "Qté" : "Qty"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isFr ? "Prix unitaire" : "Unit price"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isFr ? "Total" : "Total"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product_name}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice((item.unit_amount || 0) / 100, locale)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatPrice((item.amount_total || 0) / 100, locale)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell
                    colSpan={3}
                    className="text-right font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums text-base">
                    {formatPrice((order.amount_total || 0) / 100, locale)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stripe IDs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              {isFr ? "Identifiants Stripe" : "Stripe IDs"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground font-mono">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
                Session
              </span>
              <span className="break-all">{order.stripe_session_id}</span>
            </div>
            {order.stripe_payment_intent_id && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
                  Payment Intent
                </span>
                <span className="break-all">
                  {order.stripe_payment_intent_id}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
