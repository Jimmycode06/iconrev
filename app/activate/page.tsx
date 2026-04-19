import { redirect } from "next/navigation";
import { createClient, checkSupabaseConfigured } from "@/lib/supabase/server";
import { ActivateFlow } from "@/components/activate-flow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activate your stand — Iconrev",
  description:
    "Scan the QR code on your Iconrev stand and follow the steps to link it to your Google Business Profile.",
};

interface PageProps {
  searchParams: { id?: string };
}

export default async function ActivatePage({ searchParams }: PageProps) {
  const cardId = searchParams.id;

  if (!cardId) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Missing card ID
          </h1>
          <p className="text-muted-foreground">
            Please scan the QR code on your Iconrev stand to activate it. The
            URL should contain your unique card ID.
          </p>
        </div>
      </section>
    );
  }

  if (!checkSupabaseConfigured()) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Setup required
          </h1>
          <p className="text-muted-foreground">
            Supabase is not configured yet. Please add your Supabase URL and
            keys to <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code> and
            restart the server.
          </p>
        </div>
      </section>
    );
  }

  const supabase = createClient()!;

  const { data: card } = await supabase
    .from("cards")
    .select("review_url")
    .eq("id", cardId)
    .single();

  if (card?.review_url) {
    redirect(card.review_url);
  }

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Activate your stand
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Follow the steps below to link your Iconrev stand to your Google
            Business Profile.
          </p>
        </div>
        <ActivateFlow cardId={cardId} />
      </div>
    </section>
  );
}
