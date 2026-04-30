"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { translateAuthErrorMessageToFr } from "@/lib/auth-error-fr";

function formatAuthError(message: string, locale: string): string {
  if (locale === "fr") return translateAuthErrorMessageToFr(message);
  return message;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ResetPassword");
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);

  const stripRecoveryParams = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of [
      "code",
      "token_hash",
      "token",
      "type",
      "access_token",
      "refresh_token",
    ]) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", url.pathname + url.search);
      changed = true;
    } else if (changed) {
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const client = createClient();

    async function bootstrapRecoverySession() {
      setBootstrapLoading(true);
      setError(null);

      if (typeof window === "undefined") {
        setBootstrapLoading(false);
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const type = url.searchParams.get("type");
      const otpToken =
        url.searchParams.get("token_hash") ?? url.searchParams.get("token");

      try {
        if (code) {
          const { error: exchangeError } =
            await client.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (!cancelled) {
              setError(
                formatAuthError(exchangeError.message, locale) ||
                  t("error_exchange")
              );
            }
            setBootstrapLoading(false);
            return;
          }
          if (!cancelled) {
            setRecoveryReady(true);
            stripRecoveryParams();
          }
          setBootstrapLoading(false);
          return;
        }

        if (otpToken && type === "recovery") {
          const { error: otpError } = await client.auth.verifyOtp({
            type: "recovery",
            token_hash: otpToken,
          });
          if (otpError) {
            if (!cancelled) {
              setError(
                formatAuthError(otpError.message, locale) ||
                  t("error_exchange")
              );
            }
            setBootstrapLoading(false);
            return;
          }
          if (!cancelled) {
            setRecoveryReady(true);
            stripRecoveryParams();
          }
          setBootstrapLoading(false);
          return;
        }

        const hash = window.location.hash?.replace(/^#/, "") ?? "";
        if (hash.includes("access_token")) {
          const hp = new URLSearchParams(hash);
          const access_token = hp.get("access_token");
          const refresh_token = hp.get("refresh_token");
          if (access_token && refresh_token) {
            const { error: sessionError } = await client.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) {
              if (!cancelled) {
                setError(
                  formatAuthError(sessionError.message, locale) ||
                    t("error_exchange")
                );
              }
              setBootstrapLoading(false);
              return;
            }
            if (!cancelled) {
              setRecoveryReady(true);
              window.history.replaceState(null, "", url.pathname + url.search);
            }
            setBootstrapLoading(false);
            return;
          }
        }

        const { data } = await client.auth.getSession();
        if (!cancelled && data.session) {
          setRecoveryReady(true);
        }
      } catch {
        if (!cancelled) setError(t("error_exchange"));
      } finally {
        if (!cancelled) setBootstrapLoading(false);
      }
    }

    bootstrapRecoverySession();

    const { data: subscription } = client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setRecoveryReady(true);
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [locale, stripRecoveryParams, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t("error_short"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("error_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(formatAuthError(updateError.message, locale));
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 2500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {t("success_title")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("success_desc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {bootstrapLoading ? (
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t("checking_link")}
        </p>
      ) : !recoveryReady ? (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
          {t("waiting_link")}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="new-password"
          className="text-sm font-medium text-foreground"
        >
          {t("new_password")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="new-password"
            type="password"
            placeholder={t("placeholder_new")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9"
            required
            minLength={6}
            disabled={!recoveryReady || bootstrapLoading}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-foreground"
        >
          {t("confirm_password")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            placeholder={t("placeholder_confirm")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-9"
            required
            minLength={6}
            disabled={!recoveryReady || bootstrapLoading}
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
        disabled={loading || !recoveryReady || bootstrapLoading}
        className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-500/95 hover:via-blue-500/95 hover:to-cyan-500/95 text-white h-11"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
