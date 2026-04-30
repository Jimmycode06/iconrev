/** Traduction des messages d’erreur fréquents de Supabase Auth (souvent en anglais). */

const EXACT: Record<string, string> = {
  "Invalid login credentials": "E-mail ou mot de passe incorrect.",
  "Invalid email or password": "E-mail ou mot de passe incorrect.",
  "Email not confirmed": "Veuillez confirmer votre e-mail avant de vous connecter.",
  "User already registered": "Un compte existe déjà avec cette adresse e-mail.",
  "Password should be at least 6 characters":
    "Le mot de passe doit contenir au moins 6 caractères.",
  "Signup requires a valid password": "Veuillez choisir un mot de passe valide.",
  "Unable to validate email address: invalid format": "Adresse e-mail invalide.",
  "User not found": "Aucun compte associé à cette adresse e-mail.",
};

export function translateAuthErrorMessageToFr(message: string): string {
  const raw = message?.trim() ?? "";
  if (!raw) return "Une erreur est survenue. Réessayez.";

  if (EXACT[raw]) return EXACT[raw];

  const lower = raw.toLowerCase();
  if (lower.includes("email not confirmed")) {
    return "Veuillez confirmer votre e-mail avant de vous connecter.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (lower.includes("password") && lower.includes("6")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (lower.includes("invalid format") && lower.includes("email")) {
    return "Adresse e-mail invalide.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Trop de tentatives. Patientez quelques instants puis réessayez.";
  }

  if (/^[àâäéèêëïîôùûç\w\s\-'+.,!?]+$/i.test(raw) && /é|è|ê|à|ù|î|ô|û|ç/i.test(raw)) {
    return raw;
  }

  return "Impossible de continuer. Vérifiez vos informations ou réessayez plus tard.";
}
