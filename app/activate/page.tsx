import { redirect } from "next/navigation";
import { createClient, checkSupabaseConfigured } from "@/lib/supabase/server";
import { ActivateFlow } from "@/components/activate-flow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activez votre plaque — Iconrev",
  description:
    "Scannez le QR code de votre plaque Iconrev et suivez les étapes pour la lier à votre fiche Google Business.",
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
            ID plaque manquant
          </h1>
          <p className="text-muted-foreground">
            Veuillez scanner le QR code de votre plaque Iconrev pour l&apos;activer.
            L&apos;URL doit contenir un identifiant de plaque unique.
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
            Configuration requise
          </h1>
          <p className="text-muted-foreground">
            Supabase n&apos;est pas encore configuré. Ajoutez votre URL et vos
            clés dans <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code>, puis
            redémarrez le serveur.
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
            Activez votre plaque
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Suivez les étapes ci-dessous pour lier votre plaque Iconrev à votre
            fiche Google Business.
          </p>
        </div>
        <ActivateFlow cardId={cardId} />
      </div>
    </section>
  );
}
