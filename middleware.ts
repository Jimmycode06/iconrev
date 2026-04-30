import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
  isAdminProtectedPath,
  isAdminLoginPath,
  isAdminEmail,
  parseAdminEmailAllowlist,
} from "@/lib/admin-access";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl?.startsWith("http") && supabaseAnonKey?.startsWith("ey");

const intlMiddleware = createMiddleware(routing);

function isLocalhost(request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /** UI admin (shadcn) : protégée par Google OAuth + ADMIN_EMAILS */
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/fr/admin/orders";
    return NextResponse.redirect(url);
  }

  // OAuth callback : pas de réécriture i18n
  if (pathname.startsWith("/auth")) {
    if (!isSupabaseConfigured) return NextResponse.next();
    return handleSupabase(request);
  }

  // Skip locale routing for /activate (French-only, root-level page)
  if (pathname.startsWith("/activate")) {
    if (!isSupabaseConfigured) return NextResponse.next();
    return handleSupabase(request);
  }

  // Run next-intl locale middleware first
  const intlResponse = intlMiddleware(request);

  if (intlResponse.status !== 200 && intlResponse.headers.has("location")) {
    return intlResponse;
  }

  if (!isSupabaseConfigured) return intlResponse;

  return handleSupabaseWithResponse(request, intlResponse);
}

async function handleSupabase(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });
  createSupabaseClient(request, supabaseResponse);
  return supabaseResponse;
}

async function handleSupabaseWithResponse(
  request: NextRequest,
  response: NextResponse
) {
  let supabaseResponse = response;

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (isAdminProtectedPath(pathname)) {
    if (!isSupabaseConfigured) {
      return new NextResponse("Service non configuré", { status: 503 });
    }

    const allow = parseAdminEmailAllowlist();

    if (process.env.NODE_ENV === "production" && allow.length === 0) {
      return new NextResponse(
        "ADMIN_EMAILS non configuré sur le serveur",
        { status: 503 }
      );
    }

    if (!user) {
      const locale = pathname.startsWith("/fr") ? "fr" : "en";
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("next", pathname);
      const redirectRes = NextResponse.redirect(loginUrl);

      const supabaseRedirect = createServerClient(supabaseUrl!, supabaseAnonKey!, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              redirectRes.cookies.set(name, value, options)
            );
          },
        },
      });
      await supabaseRedirect.auth.getUser();
      return redirectRes;
    }

    if (!isAdminEmail(user.email, allow)) {
      return new NextResponse(
        "Accès refusé : votre compte n’est pas autorisé sur cet espace admin.",
        { status: 403 }
      );
    }
  }

  if (isAdminLoginPath(pathname) && user) {
    const allow = parseAdminEmailAllowlist();
    if (isAdminEmail(user.email, allow)) {
      const locale = pathname.startsWith("/fr") ? "fr" : "en";
      const next = request.nextUrl.searchParams.get("next");
      const dest =
        next && next.startsWith("/") ? next : `/${locale}/admin/orders`;
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return supabaseResponse;
}

function createSupabaseClient(request: NextRequest, response: NextResponse) {
  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
