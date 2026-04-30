import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  order_number: number | null;
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
      "id,order_number,stripe_session_id,stripe_payment_intent_id,customer_email,amount_total,currency,payment_status,order_status,business_name,business_address,shipping_name,shipping_line1,shipping_line2,shipping_city,shipping_state,shipping_postal_code,shipping_country,created_at,order_items(id,product_name,quantity,unit_amount,amount_total,currency)"
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

  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.amount_total || 0), 0) ?? 0;

  return (
    <>
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <Link
            href={`/${locale}/admin/orders`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            {isFr ? "Commandes" : "Orders"}
          </Link>
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-medium text-muted-foreground font-mono">
            {order.order_number != null
              ? `#${order.order_number}`
              : (isFr ? "Commande" : "Order")}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">

        {/* Title row */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            className={order.payment_status === "paid"
              ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 gap-1.5 px-3 py-1 text-sm"
              : "gap-1.5 px-3 py-1 text-sm"}
            variant="outline"
          >
            {order.payment_status === "paid" ? (isFr ? "Payée" : "Paid") : order.payment_status}
          </Badge>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {order.order_number != null
                ? `${isFr ? "Commande" : "Order"} #${order.order_number}`
                : new Date(order.created_at).toLocaleString(locale_, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </h1>
            {order.order_number != null && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {new Date(order.created_at).toLocaleString(locale_, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {order.order_items && order.order_items.length > 0 && (
              <p className="text-sm font-medium text-foreground mt-2 max-w-2xl">
                {order.order_items
                  .map((i) => `${i.quantity}× ${i.product_name}`)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* LEFT — order items + totals (2/3) */}
          <div className="flex flex-col gap-4 lg:col-span-2">

            {/* Items card */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b space-y-2">
                <h2 className="text-base font-semibold">
                  {isFr ? "Contenu de la commande" : "What was ordered"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {order.order_items?.length
                    ? isFr
                      ? `${order.order_items.length} article(s)`
                      : `${order.order_items.length} item(s)`
                    : (isFr ? "Aucun article enregistré" : "No line items stored")}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={order.order_status === "fulfilled"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"}
                    variant="outline"
                  >
                    {order.order_status === "fulfilled"
                      ? (isFr ? "Traité" : "Fulfilled")
                      : (isFr ? "En attente" : "Pending")}
                  </Badge>
                </div>
              </div>

              {/* Items list */}
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-start sm:items-center gap-4 px-5 py-4 ${
                      i < order.order_items.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-[10px] font-medium leading-tight text-center px-0.5 shrink-0">
                      QR+NFC
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base leading-snug">
                        {item.quantity}× {item.product_name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isFr ? "Prix unitaire" : "Unit"}{" "}
                        {formatPrice((item.unit_amount || 0) / 100, locale)} ·{" "}
                        {isFr ? "Total ligne" : "Line total"}{" "}
                        {formatPrice((item.amount_total || 0) / 100, locale)}
                      </p>
                    </div>
                    <p className="font-bold tabular-nums text-base shrink-0">
                      {formatPrice((item.amount_total || 0) / 100, locale)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  {isFr
                    ? "Les articles n’ont pas pu être rechargés. Vérifiez Supabase ou le webhook Stripe."
                    : "Line items could not be loaded. Check Supabase or the Stripe webhook."}
                </div>
              )}
            </div>

            {/* Totals card */}
            <div className="rounded-xl border bg-card shadow-xs px-5 py-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{isFr ? "Sous-total" : "Subtotal"}</span>
                <span>{order.order_items?.length ?? 0} {isFr ? "article(s)" : "item(s)"}</span>
                <span className="tabular-nums">{formatPrice(subtotal / 100, locale)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span />
                <span className="tabular-nums">{formatPrice((order.amount_total || 0) / 100, locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{isFr ? "Payé" : "Paid"}</span>
                <span />
                <span className="tabular-nums">{formatPrice((order.amount_total || 0) / 100, locale)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — customer + shipping (1/3) */}
          <div className="flex flex-col gap-4">

            {/* Customer card */}
            <div className="rounded-xl border bg-card shadow-xs px-5 py-4 space-y-3 text-sm">
              <p className="font-semibold">{isFr ? "Client" : "Customer"}</p>
              <div className="space-y-1">
                {order.shipping_name && (
                  <p className="font-medium">{order.shipping_name}</p>
                )}
                {order.customer_email && (
                  <p className="text-muted-foreground">{order.customer_email}</p>
                )}
              </div>
              {order.business_name && (
                <>
                  <Separator />
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      {isFr ? "Établissement" : "Business"}
                    </p>
                    <p className="font-medium">{order.business_name}</p>
                    {order.business_address && (
                      <p className="text-muted-foreground text-xs">{order.business_address}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Shipping address card */}
            <div className="rounded-xl border bg-card shadow-xs px-5 py-4 space-y-2 text-sm">
              <p className="font-semibold">{isFr ? "Adresse d'expédition" : "Shipping address"}</p>
              {shippingLines.length > 0 ? (
                <div className="space-y-0.5 text-muted-foreground">
                  {shippingLines.map((line, i) => (
                    <p key={i} className={i === 0 ? "font-medium text-foreground" : ""}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
