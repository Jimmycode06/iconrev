"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { translateAuthErrorMessageToFr } from "@/lib/auth-error-fr";
import {
  Loader2,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Building2,
  ArrowLeft,
} from "lucide-react";

type Tab = "login" | "register";
type View = "auth" | "forgot" | "forgot-sent";

interface AuthFormProps {
  onAuthenticated: (email: string) => void;
}

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [view, setView] = useState<View>("auth");
  const [tab, setTab] = useState<Tab>("register");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { business_name: businessName },
          },
        });

        if (signUpError) {
          setError(translateAuthErrorMessageToFr(signUpError.message));
          return;
        }

        if (data.session) {
          onAuthenticated(email);
        } else {
          setConfirmationSent(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(translateAuthErrorMessageToFr(signInError.message));
          return;
        }

        onAuthenticated(email);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/fr/reset-password`
          : undefined;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo }
      );

      if (resetError) {
        setError(translateAuthErrorMessageToFr(resetError.message));
        return;
      }

      setView("forgot-sent");
    } finally {
      setLoading(false);
    }
  }

  if (confirmationSent) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Vérifiez votre e-mail
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Nous avons envoyé un lien de confirmation à <strong>{email}</strong>.
          Cliquez sur le lien pour activer votre compte, puis revenez ici.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setConfirmationSent(false);
            setTab("login");
          }}
        >
          J&apos;ai confirmé mon e-mail — me connecter
        </Button>
      </div>
    );
  }

  if (view === "forgot-sent") {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Vérifiez votre e-mail
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Si <strong>{email}</strong> correspond à un compte, nous avons envoyé
          un lien pour réinitialiser votre mot de passe.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setView("auth");
            setTab("login");
            setError(null);
          }}
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  if (view === "forgot") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setView("auth");
            setError(null);
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à la connexion
        </button>

        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Réinitialiser votre mot de passe
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Entrez votre e-mail et nous vous enverrons un lien pour définir un
            nouveau mot de passe.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="forgot-email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="forgot-email"
                type="email"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-500/95 hover:via-blue-500/95 hover:to-cyan-500/95 text-white h-11"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg border border-border bg-muted/40 p-1">
        {(["register", "login"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setError(null);
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              tab === t
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "register" ? (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                Créer un compte
              </>
            ) : (
              <>
                <LogIn className="h-3.5 w-3.5" />
                Se connecter
              </>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {tab === "register" && (
          <div className="space-y-1.5">
            <label
              htmlFor="auth-business"
              className="text-sm font-medium text-foreground"
            >
              Nom de l&apos;établissement
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="auth-business"
                type="text"
                placeholder="Mon restaurant, Mon salon..."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="auth-email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-email"
              type="email"
              placeholder="vous@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="auth-password"
              className="text-sm font-medium text-foreground"
            >
              Mot de passe
            </label>
            {tab === "login" && (
              <button
                type="button"
                onClick={() => {
                  setView("forgot");
                  setError(null);
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-password"
              type="password"
              placeholder={
                tab === "register"
                  ? "Au moins 6 caractères"
                  : "Votre mot de passe"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
              required
              minLength={6}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-500/95 hover:via-blue-500/95 hover:to-cyan-500/95 text-white h-11"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : tab === "register" ? (
            "Créer mon compte"
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </div>
  );
}
