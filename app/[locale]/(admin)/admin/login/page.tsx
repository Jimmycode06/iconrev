"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

function AdminLoginInner() {
  const t = useTranslations("AdminLogin");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? `/${locale}/admin/orders`;
  const err = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function signInGoogle() {
    setLoading(true);
    const origin = window.location.origin;
    const safeNext = next.startsWith("/") ? next : `/${locale}/admin/orders`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });
    if (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-center mb-1">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {t("subtitle")}
        </p>

        {err === "oauth_failed" || err === "missing_code" ? (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-4">
            {t("error_oauth")}
          </p>
        ) : null}

        <Button
          type="button"
          className="w-full h-11 gap-2"
          onClick={signInGoogle}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {t("google")}
        </Button>

        <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
          {t("hint_env")}
        </p>

        <p className="mt-4 text-center text-sm">
          <Link href={`/${locale}`} className="text-blue-600 hover:underline">
            {t("back_site")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
