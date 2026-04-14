import { redirect } from "next/navigation";

export default function ProductDetailRedirectPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/products?pack=${encodeURIComponent(params.id)}`);
}
