import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl?.startsWith("http") && supabaseAnonKey?.startsWith("ey");

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale routing for /activate (French-only, root-level page)
  if (pathname.startsWith("/activate")) {
    if (!isSupabaseConfigured) return NextResponse.next();
    return handleSupabase(request);
  }

  // Run next-intl locale middleware first
  const intlResponse = intlMiddleware(request);

  // If next-intl wants to redirect/rewrite, do that
  if (intlResponse.status !== 200 && intlResponse.headers.has("location")) {
    return intlResponse;
  }

  // Also handle Supabase session refresh
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
): Promise<NextResponse> {
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

  await supabase.auth.getUser();

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
    // Match all paths except static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
