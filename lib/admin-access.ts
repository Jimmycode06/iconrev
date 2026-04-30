/**
 * E-mails autorisés pour /admin (Google OAuth Supabase).
 * Variable d'environnement : ADMIN_EMAILS=jim@x.com,autre@y.com
 * (séparateur virgule, comparaison insensible à la casse)
 */
export function parseAdminEmailAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(
  email: string | undefined,
  allowlist: string[] = parseAdminEmailAllowlist()
): boolean {
  if (!email?.trim()) return false;
  const normalized = email.trim().toLowerCase();
  if (allowlist.length > 0) {
    return allowlist.includes(normalized);
  }
  // Sans liste : en prod personne n’accède à l’admin ; en dev on facilite les tests.
  return process.env.NODE_ENV !== "production";
}

/** Route publique (pas de session requise). */
export function isAdminLoginPath(pathname: string): boolean {
  const path = pathname.split("?")[0];
  return path.endsWith("/admin/login") || path.endsWith("/admin/login/");
}

export function isAdminProtectedPath(pathname: string): boolean {
  return pathname.includes("/admin") && !isAdminLoginPath(pathname);
}
