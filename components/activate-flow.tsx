"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthForm } from "@/components/auth-form";
import { PlacesSearch, type PlaceResult } from "@/components/places-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Search,
  UserPlus,
  MapPin,
  Building2,
  Loader2,
  PartyPopper,
  ExternalLink,
} from "lucide-react";

type Step = "auth" | "search" | "confirm" | "done";

interface ActivateFlowProps {
  cardId: string;
}

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "auth", label: "Compte", icon: UserPlus },
  { key: "search", label: "Trouver l'etablissement", icon: Search },
  { key: "confirm", label: "Activer", icon: CheckCircle2 },
];

export function ActivateFlow({ cardId }: ActivateFlowProps) {
  const [step, setStep] = useState<Step>("auth");
  const [email, setEmail] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        setStep("search");
      }
    }
    checkSession();
  }, [supabase.auth]);

  function handleAuthenticated(userEmail: string) {
    setEmail(userEmail);
    setStep("search");
  }

  function handlePlaceSelected(place: PlaceResult) {
    setSelectedPlace(place);
    setStep("confirm");
  }

  async function handleActivate() {
    if (!selectedPlace) return;

    setActivating(true);
    setError(null);

    try {
      const res = await fetch("/api/cards/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          googlePlaceId: selectedPlace.placeId,
          businessName: selectedPlace.name,
          businessAddress: selectedPlace.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Echec de l'activation. Veuillez reessayer.");
        return;
      }

      setReviewUrl(data.reviewUrl);
      setStep("done");
    } catch {
      setError("Erreur reseau. Verifiez votre connexion puis reessayez.");
    } finally {
      setActivating(false);
    }
  }

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress stepper */}
      {step !== "done" && (
        <nav className="mb-8" aria-label="Progression de l'activation">
          <ol className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = s.key === step;
              const isDone = i < currentStepIdx;

              return (
                <li key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all",
                        isDone
                          ? "bg-blue-600 text-white"
                          : isActive
                          ? "bg-blue-100 text-blue-700 ring-2 ring-blue-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span
                      className={cn(
                        "hidden sm:block text-sm font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-[2px] mx-3",
                        i < currentStepIdx ? "bg-blue-600" : "bg-border"
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Step content */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        {step === "auth" && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Creez votre compte
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Inscrivez-vous pour activer votre plaque Iconrev et commencer a
              collecter des avis Google.
            </p>
            <AuthForm onAuthenticated={handleAuthenticated} />
          </div>
        )}

        {step === "search" && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Trouvez votre etablissement
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Recherchez votre etablissement sur Google pour lier votre plaque.
            </p>
            <PlacesSearch onSelect={handlePlaceSelected} />
          </div>
        )}

        {step === "confirm" && selectedPlace && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                Confirmer l'activation
              </h2>
              <p className="text-sm text-muted-foreground">
                Verifiez qu'il s'agit du bon etablissement avant d'activer.
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-base">
                    {selectedPlace.name}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {selectedPlace.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm text-muted-foreground space-y-1">
              <p>
                <strong className="text-foreground">ID carte :</strong> {cardId}
              </p>
              <p>
                <strong className="text-foreground">Compte :</strong> {email}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPlace(null);
                  setStep("search");
                  setError(null);
                }}
                className="flex-1"
              >
                Changer d'etablissement
              </Button>
              <Button
                onClick={handleActivate}
                disabled={activating}
                className="flex-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-500/95 hover:via-blue-500/95 hover:to-cyan-500/95 text-white"
              >
                {activating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Activer ma plaque"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <PartyPopper className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Tout est pret !
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Votre plaque est maintenant active. Quand les clients la
              scannent, ils arrivent directement sur votre page d'avis Google.
            </p>
            {selectedPlace && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-left max-w-xs mx-auto">
                <p className="font-semibold text-foreground text-sm">
                  {selectedPlace.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedPlace.address}
                </p>
              </div>
            )}
            {reviewUrl && (
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Tester votre lien d'avis
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
