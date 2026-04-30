import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Password recovery & email confirmations (Supabase SSR pattern).
 *
 * For cross-device / mobile-mail -> desktop-browser flows, PKCE codes from the
 * default magic link often lack a local code_verifier. The robust fix is to put
 * token_hash + type on this route (see comment at bottom of file). If Supabase
 * redirects here with a PKCE `code`, keep the exchange in the browser where the
 * original verifier cookie/local storage was created.
 */
function safeConfirmNext(next: string | null): string {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("..")
  ) {
    return "/fr/reset-password";
  }
  return next;
}

function isEmailOtpType(t: string): t is EmailOtpType {
  return (
    t === "signup" ||
    t === "invite" ||
    t === "magiclink" ||
    t === "recovery" ||
    t === "email_change" ||
    t === "email"
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = safeConfirmNext(requestUrl.searchParams.get("next"));
  const code = requestUrl.searchParams.get("code");
  const typeRaw = requestUrl.searchParams.get("type");
  const token_hash =
    requestUrl.searchParams.get("token_hash") ??
    requestUrl.searchParams.get("token");

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* ignore */
          }
        },
      },
    }
  );

  const redirectWithError = () => {
    const dest = new URL(next, requestUrl.origin);
    dest.searchParams.set("recovery_error", "1");
    return NextResponse.redirect(dest);
  };

  if (token_hash && typeRaw && isEmailOtpType(typeRaw)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: typeRaw,
    });
    if (error) {
      return redirectWithError();
    }
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  if (code) {
    const dest = new URL(next, requestUrl.origin);
    dest.searchParams.set("code", code);
    return NextResponse.redirect(dest);
  }

  return redirectWithError();
}

/*
  Supabase → Auth → Email templates → « Reset password » :
  utilisez un lien direct vers cette route avec token_hash pour que la
  réinitialisation fonctionne même si l’utilisateur ouvre le mail sur un autre
  appareil (le flux PKCE avec ?code= seul exige le même navigateur).

  Exemple de href pour le bouton :
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/fr/reset-password">…</a>

  Ajoutez aussi l’URL de base de /auth/confirm dans Authentication → URL Configuration → Redirect URLs.
*/
