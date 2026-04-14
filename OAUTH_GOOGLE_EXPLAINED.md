# Comment Accéder à l'API Google Business de Chaque Client

## 🔐 Le Problème

Chaque client a son propre compte Google Business. Vous ne pouvez pas accéder à leurs données sans leur autorisation.

**Solution : OAuth 2.0** - Chaque client autorise votre application à accéder à ses données Google.

## 🔄 Flux d'Authentification (OAuth 2.0)

### Étape par Étape :

```
1. Client s'inscrit sur votre SaaS
   ↓
2. Client clique sur "Connecter mon Google Business"
   ↓
3. Redirection vers Google
   ↓
4. Client se connecte à son compte Google
   ↓
5. Google demande : "Iconrev veut accéder à vos avis Google. Autorisez ?"
   ↓
6. Client clique "Autoriser"
   ↓
7. Google redirige vers votre site avec un CODE
   ↓
8. Votre serveur échange ce CODE contre un TOKEN
   ↓
9. Vous stockez le TOKEN (sécurisé) pour ce client
   ↓
10. Maintenant vous pouvez accéder à ses avis Google via l'API !
```

## 📝 Implémentation Technique

### Étape 1 : Configuration Initiale Google Cloud

Dans Google Cloud Console :

1. Créez un "OAuth 2.0 Client ID"
2. Configurez les URLs de redirection :
   - `http://localhost:3000/api/auth/google/callback` (dev)
   - `https://iconrev.com/api/auth/google/callback` (prod)
3. Notez votre `CLIENT_ID` et `CLIENT_SECRET`

### Étape 2 : Client Clicque sur "Connecter Google Business"

```typescript
// components/connect-google-button.tsx
export function ConnectGoogleButton() {
  const connectGoogle = () => {
    // Rediriger vers Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
      client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&
      redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback&
      response_type=code&
      scope=https://www.googleapis.com/auth/business.manage&
      access_type=offline&
      prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  return <Button onClick={connectGoogle}>Connecter mon Google Business</Button>;
}
```

### Étape 3 : Google Redirige avec un CODE

```typescript
// app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { encrypt } from "@/lib/encryption"; // Pour sécuriser les tokens

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const userId = searchParams.get("state"); // ID de l'utilisateur de votre SaaS

  if (!code || !userId) {
    return NextResponse.redirect("/dashboard?error=missing_code");
  }

  // Configuration OAuth
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  try {
    // 🔑 ÉTAPE CRUCIALE : Échanger le CODE contre un TOKEN
    const { tokens } = await oauth2Client.getToken(code);

    // Tokens obtenus :
    // - access_token : Pour faire les requêtes API (expire après 1h)
    // - refresh_token : Pour obtenir un nouveau access_token (valide longtemps)
    // - expiry_date : Quand le access_token expire

    // 💾 Stocker les tokens ENCRYPTÉS en base de données
    await db.users.update(userId, {
      googleAccessToken: encrypt(tokens.access_token),
      googleRefreshToken: encrypt(tokens.refresh_token), // Important pour renouveler
      googleTokenExpiry: tokens.expiry_date,
      googleBusinessConnected: true,
    });

    // Rediriger vers le dashboard
    return NextResponse.redirect("/dashboard?success=connected");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.redirect("/dashboard?error=auth_failed");
  }
}
```

### Étape 4 : Utiliser le Token pour Accéder aux Avis

```typescript
// lib/google-business-client.ts
import { google } from "googleapis";

export async function getClientReviews(userId: string) {
  // 1. Récupérer les tokens de ce client depuis la base de données
  const user = await db.users.findById(userId);

  if (!user.googleAccessToken) {
    throw new Error("Client not connected to Google Business");
  }

  // 2. Décrypter le token
  const accessToken = decrypt(user.googleAccessToken);
  const refreshToken = decrypt(user.googleRefreshToken);

  // 3. Créer un client OAuth avec les tokens
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: user.googleTokenExpiry,
  });

  // 4. Vérifier si le token a expiré et le renouveler si nécessaire
  if (oauth2Client.isTokenExpiring()) {
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Mettre à jour les tokens en base
    await db.users.update(userId, {
      googleAccessToken: encrypt(credentials.access_token),
      googleTokenExpiry: credentials.expiry_date,
    });

    oauth2Client.setCredentials(credentials);
  }

  // 5. Maintenant vous pouvez utiliser l'API Google Business !
  const mybusiness = google.mybusinessaccountmanagement({
    version: "v1",
    auth: oauth2Client,
  });

  // Récupérer les avis de ce client
  const response = await mybusiness.accounts.locations.reviews.list({
    parent: `accounts/${user.googleAccountId}/locations/${user.googleLocationId}`,
  });

  return response.data.reviews || [];
}
```

## 🗄️ Structure de Base de Données

```sql
-- Table des utilisateurs de votre SaaS
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  -- ... autres champs

  -- Connexion Google Business
  google_business_connected BOOLEAN DEFAULT false,
  google_account_id VARCHAR(255), -- ID du compte Google Business
  google_location_id VARCHAR(255), -- ID de l'établissement

  -- Tokens OAuth (ENCRYPTÉS)
  google_access_token_encrypted TEXT,
  google_refresh_token_encrypted TEXT,
  google_token_expiry TIMESTAMP,

  created_at TIMESTAMP
);
```

## 🎯 Workflow Complet pour Chaque Client

### Première Connexion :

1. **Client s'inscrit** sur votre SaaS → Création d'un compte
2. **Client va dans son dashboard** → Voit "Connecter Google Business"
3. **Client clique** → Redirection vers Google
4. **Client se connecte** à son compte Google (celui qui gère son établissement)
5. **Google demande** : "Iconrev veut accéder à vos avis. Autoriser ?"
6. **Client autorise** → Google redirige vers votre site avec un CODE
7. **Votre serveur échange** CODE → TOKEN
8. **Vous stockez le TOKEN** dans votre base de données (lié à ce client)
9. **Voilà !** Vous pouvez maintenant accéder à SES avis Google

### Utilisation Quotidienne :

```
Nouvel avis arrive sur Google Business du Client A
    ↓
Votre serveur détecte (webhook ou polling)
    ↓
Récupère le token de Client A depuis votre base de données
    ↓
Utilise ce token pour accéder à l'API Google de Client A
    ↓
Récupère l'avis
    ↓
Génère la réponse par IA
    ↓
Publie la réponse avec le token de Client A
```

## 🔐 Sécurité : Chaque Client a son Propre Token

**Important** :

- ✅ Chaque client a son propre token OAuth (stocké séparément)
- ✅ Vous ne pouvez accéder qu'aux données du client qui vous a autorisé
- ✅ Le token de Client A ne fonctionne pas pour Client B
- ✅ Les tokens sont encryptés dans votre base de données

## 💡 Exemple Concret

**Client A** (Restaurant Le Jardin, Paris) :

- Token stocké : `encrypted_token_A`
- Quand vous faites une requête avec ce token → Vous accédez aux avis de "Restaurant Le Jardin"

**Client B** (Salon Coiffure Marie, Lyon) :

- Token stocké : `encrypted_token_B`
- Quand vous faites une requête avec ce token → Vous accédez aux avis de "Salon Coiffure Marie"

**Vous ne pouvez pas mélanger** : Le token A ne donne pas accès aux données de B.

## 🔄 Renouvellement Automatique des Tokens

Les `access_token` expirent après 1h. Le `refresh_token` permet d'en obtenir de nouveaux :

```typescript
// lib/refresh-token.ts
export async function refreshGoogleToken(userId: string) {
  const user = await db.users.findById(userId);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: decrypt(user.googleRefreshToken),
  });

  // Renouveler automatiquement
  const { credentials } = await oauth2Client.refreshAccessToken();

  // Mettre à jour en base
  await db.users.update(userId, {
    googleAccessToken: encrypt(credentials.access_token),
    googleTokenExpiry: credentials.expiry_date,
  });
}
```

## 📊 Dashboard Client

Dans le dashboard de votre SaaS, le client voit :

```
✅ Google Business connecté
   Restaurant Le Jardin, Paris

📊 Statistiques
   - 25 avis ce mois
   - 15 réponses automatiques
   - 4.8 ⭐ moyenne

⚙️ Paramètres
   - Publication automatique : Activée
   - Ton préféré : Chaleureux
```

## 🎓 Résumé Simple

**Question** : Comment accéder à l'API Google Business de chaque client ?

**Réponse** :

1. Chaque client **autorise** votre application (OAuth 2.0)
2. Google vous donne un **TOKEN** unique pour ce client
3. Vous **stockez** ce token (encrypté) dans votre base de données
4. Chaque fois que vous voulez accéder à ses données, vous utilisez **SON token**
5. Le token fonctionne **uniquement pour ce client**, pas pour les autres

**C'est comme donner une clé** : Chaque client vous donne une clé pour ouvrir sa propre porte, mais vous ne pouvez pas ouvrir la porte des autres clients.




