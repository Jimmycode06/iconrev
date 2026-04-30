import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function safeInternalPath(next: string | null): string {
  const fallback = "/fr/admin/orders";
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("..")) {
    return fallback;
  }
  return next;
}

/** OAuth Google (et autres) : échange du code PKCE contre une session. */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeInternalPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/fr/admin/login?error=missing_code", requestUrl.origin)
    );
  }

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/fr/admin/login?error=${encodeURIComponent("oauth_failed")}`,
        requestUrl.origin
      )
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
