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

type Props = {
  orders: Order[];
  locale: string;
  isFr: boolean;
};

export function AdminOrdersTable({ orders, locale, isFr }: Props) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{isFr ? "Date" : "Date"}</TableHead>
          <TableHead>{isFr ? "Client" : "Customer"}</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>{isFr ? "Statut du paiement" : "Payment status"}</TableHead>
          <TableHead>{isFr ? "Statut de la commande" : "Order status"}</TableHead>
          <TableHead>{isFr ? "Articles" : "Items"}</TableHead>
          <TableHead>{isFr ? "Pays" : "Country"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push(`/${locale}/admin/orders/${order.id}`)}
          >
            <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
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
            </TableCell>
            <TableCell className="text-sm">
              {order.customer_email || "—"}
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {formatPrice((order.amount_total || 0) / 100, locale)}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  order.payment_status === "paid"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }
                variant="outline"
              >
                {order.payment_status === "paid"
                  ? isFr ? "Payé" : "Paid"
                  : order.payment_status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                variant="outline"
              >
                {order.order_status === "pending"
                  ? isFr ? "En attente" : "Pending"
                  : order.order_status === "fulfilled"
                  ? isFr ? "Traité" : "Fulfilled"
                  : order.order_status || (isFr ? "Nouveau" : "New")}
              </Badge>
            </TableCell>
            <TableCell>
              <ul className="space-y-0.5">
                {order.order_items?.map((item) => (
                  <li key={item.id} className="text-xs text-muted-foreground">
                    {item.quantity}× {item.product_name}
                  </li>
                ))}
              </ul>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {order.shipping_country || "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
