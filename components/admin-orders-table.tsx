"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

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

type Props = {
  orders: Order[];
  locale: string;
  isFr: boolean;
};

function formatDate(date: string, isFr: boolean): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const sameDay =
    d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (sameDay) {
    if (diffMin < 1) return isFr ? "À l'instant" : "Just now";
    if (diffMin < 60)
      return isFr ? `Il y a ${diffMin} min` : `${diffMin} min ago`;
    return isFr ? `Il y a ${diffH} h` : `${diffH} h ago`;
  }
  if (isYesterday) {
    const time = d.toLocaleTimeString(isFr ? "fr-FR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return isFr ? `Hier à ${time}` : `Yesterday at ${time}`;
  }
  if (diffDays < 7) {
    return d.toLocaleDateString(isFr ? "fr-FR" : "en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString(isFr ? "fr-FR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${color}`}
      aria-hidden
    />
  );
}

export function AdminOrdersTable({ orders, locale, isFr }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[960px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[110px]">
              {isFr ? "Commande" : "Order"}
            </TableHead>
            <TableHead className="w-[150px]">{isFr ? "Date" : "Date"}</TableHead>
            <TableHead>{isFr ? "Client" : "Customer"}</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>{isFr ? "Statut du paiement" : "Payment status"}</TableHead>
            <TableHead>
              {isFr
                ? "Statut du traitement de la commande"
                : "Fulfillment status"}
            </TableHead>
            <TableHead className="text-right">
              {isFr ? "Articles" : "Items"}
            </TableHead>
            <TableHead>
              {isFr ? "Statut de la livraison" : "Delivery status"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const itemCount = (order.order_items ?? []).reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            );
            const isPaid = order.payment_status === "paid";
            const isFulfilled = order.order_status === "fulfilled";
            const hasTracking =
              !!order.tracking_number && !!order.tracking_url;

            return (
              <TableRow
                key={order.id}
                className={
                  isFulfilled
                    ? "cursor-pointer bg-gray-100/80 text-muted-foreground hover:bg-gray-200/70 transition-colors"
                    : "cursor-pointer bg-white hover:bg-muted/40 transition-colors"
                }
                onClick={() =>
                  router.push(`/${locale}/admin/orders/${order.id}`)
                }
              >
                {/* Commande */}
                <TableCell className="whitespace-nowrap text-sm font-semibold font-mono">
                  {order.order_number != null
                    ? `#${order.order_number}`
                    : "—"}
                </TableCell>

                {/* Date */}
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(order.created_at, isFr)}
                </TableCell>

                {/* Client */}
                <TableCell className="text-sm">
                  <div className="font-medium leading-tight">
                    {order.shipping_name ||
                      order.customer_email ||
                      (isFr ? "Client" : "Customer")}
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">
                  {formatPrice((order.amount_total || 0) / 100, locale)}
                </TableCell>

                {/* Payment status (Shopify-like: neutral gray) */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 gap-1.5"
                  >
                    <StatusDot color="bg-gray-500" />
                    {isPaid
                      ? isFr
                        ? "Payée"
                        : "Paid"
                      : order.payment_status}
                  </Badge>
                </TableCell>

                {/* Fulfillment status (yellow when unfulfilled, gray when fulfilled) */}
                <TableCell>
                  {isFulfilled ? (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 gap-1.5"
                    >
                      <StatusDot color="bg-gray-500" />
                      {isFr ? "Traité" : "Fulfilled"}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200 gap-1.5"
                    >
                      <StatusDot color="bg-amber-500" />
                      {isFr ? "Non traité" : "Unfulfilled"}
                    </Badge>
                  )}
                </TableCell>

                {/* Items count */}
                <TableCell className="text-right text-sm whitespace-nowrap">
                  {itemCount > 0
                    ? `${itemCount} ${
                        isFr
                          ? itemCount > 1
                            ? "articles"
                            : "article"
                          : itemCount > 1
                          ? "items"
                          : "item"
                      }`
                    : "—"}
                </TableCell>

                {/* Delivery status */}
                <TableCell>
                  {isFulfilled && hasTracking ? (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 gap-1.5"
                    >
                      <StatusDot color="bg-gray-500" />
                      {isFr ? "Suivi ajouté" : "Tracking added"}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
