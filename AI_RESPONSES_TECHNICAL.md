# Guide Technique : Réponses Automatiques aux Avis par IA

## 🔧 Architecture Technique

### Stack Technologique Recommandée

**Backend :**
- Next.js 14 (API Routes)
- Google My Business API / Google Business Profile API
- OpenAI API (GPT-4) ou Anthropic Claude
- PostgreSQL / MongoDB (base de données)
- Redis (cache et queues)

**Authentification :**
- OAuth 2.0 avec Google
- Stockage des tokens d'accès (encryptés)

## 📡 Étape 1 : Détecter les Nouveaux Avis

### Option A : Google My Business API (Recommandé)

```typescript
// lib/google-business.ts
import { google } from 'googleapis';

export async function getRecentReviews(businessId: string, accessToken: string) {
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: accessToken });

  const mybusiness = google.mybusinessaccountmanagement('v1');
  
  // Récupérer les avis récents
  const response = await mybusiness.accounts.locations.reviews.list({
    auth: client,
    name: `accounts/${businessId}/locations/${locationId}`,
    pageSize: 50,
  });

  return response.data.reviews || [];
}
```

### Option B : Webhooks (Meilleure solution)

```typescript
// app/api/webhooks/google-reviews/route.ts
export async function POST(request: Request) {
  // Google envoie une notification quand un nouvel avis arrive
  const body = await request.json();
  
  if (body.eventType === 'NEW_REVIEW') {
    const review = body.review;
    
    // Traiter le nouvel avis
    await processNewReview(review);
  }
  
  return Response.json({ received: true });
}
```

### Option C : Polling Régulier (Simple mais moins optimal)

```typescript
// lib/poll-reviews.ts
export async function pollNewReviews(businessId: string) {
  // Exécuter toutes les 5 minutes via cron job
  const lastCheck = await getLastCheckTimestamp(businessId);
  const reviews = await getReviewsSince(businessId, lastCheck);
  
  for (const review of reviews) {
    if (!review.response) {
      // Nouvel avis sans réponse → générer une réponse
      await generateAIResponse(review);
    }
  }
  
  await updateLastCheckTimestamp(businessId, Date.now());
}
```

## 🤖 Étape 2 : Générer une Réponse par IA

### Exemple avec OpenAI

```typescript
// lib/ai-response-generator.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Review {
  text: string;
  rating: number;
  authorName: string;
}

interface BusinessContext {
  name: string;
  sector: string; // 'restaurant', 'salon', 'garage', etc.
  tone: 'warm' | 'professional' | 'casual';
}

export async function generateAIResponse(
  review: Review,
  businessContext: BusinessContext
): Promise<string> {
  
  const systemPrompt = `Tu es un assistant qui répond aux avis Google pour ${businessContext.name}, un ${businessContext.sector}.
  
Règles importantes :
- Réponses en français
- Ton ${businessContext.tone}
- Maximum 150 mots
- Toujours professionnel et courtois
- Pour avis négatifs : être empathique, s'excuser, proposer une résolution
- Pour avis positifs : remercier chaleureusement`;

  const userPrompt = review.rating >= 4
    ? `L'avis suivant est positif (${review.rating}/5 étoiles). Génère une réponse chaleureuse :
    
Avis : "${review.text}"
Auteur : ${review.authorName}

Réponds comme si tu étais le propriétaire de l'établissement.`
    
    : `L'avis suivant est négatif (${review.rating}/5 étoiles). Génère une réponse empathique et professionnelle :
    
Avis : "${review.text}"
Auteur : ${review.authorName}

Réponds en t'excusant et en proposant de résoudre le problème.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return completion.choices[0].message.content || '';
}
```

## 💾 Étape 3 : Enregistrer et Valider

```typescript
// lib/review-handler.ts
export async function processNewReview(review: Review, businessId: string) {
  // 1. Enregistrer l'avis dans la base de données
  await db.reviews.create({
    businessId,
    googleReviewId: review.reviewId,
    text: review.text,
    rating: review.rating,
    authorName: review.authorName,
    createdAt: review.createTime,
  });

  // 2. Récupérer le contexte de l'établissement
  const business = await db.businesses.findById(businessId);
  
  // 3. Générer la réponse par IA
  const aiResponse = await generateAIResponse(review, {
    name: business.name,
    sector: business.sector,
    tone: business.preferredTone,
  });

  // 4. Enregistrer la réponse générée
  const response = await db.reviewResponses.create({
    reviewId: review.reviewId,
    generatedResponse: aiResponse,
    status: business.autoPublish ? 'pending' : 'draft', // auto ou manuel
    createdAt: new Date(),
  });

  // 5. Publier automatiquement si configuré
  if (business.autoPublish) {
    await publishResponseToGoogle(review.reviewId, aiResponse, business.accessToken);
    await db.reviewResponses.update(response.id, { status: 'published' });
  } else {
    // Envoyer notification email au propriétaire pour validation
    await sendValidationEmail(business.ownerEmail, {
      review: review.text,
      suggestedResponse: aiResponse,
      reviewId: review.reviewId,
    });
  }
}
```

## 📤 Étape 4 : Publier la Réponse sur Google

```typescript
// lib/google-publisher.ts
import { google } from 'googleapis';

export async function publishResponseToGoogle(
  reviewId: string,
  responseText: string,
  accessToken: string
) {
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: accessToken });

  const mybusiness = google.mybusinessaccountmanagement('v1');
  
  await mybusiness.accounts.locations.reviews.updateReply({
    auth: client,
    name: `accounts/${accountId}/locations/${locationId}/reviews/${reviewId}`,
    requestBody: {
      reply: {
        comment: responseText,
      },
    },
  });
}
```

## 🔐 Étape 5 : Authentification Google OAuth

```typescript
// app/api/auth/google/callback/route.ts
import { google } from 'googleapis';

export async function GET(request: Request) {
  const { code } = request.nextUrl.searchParams;
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Échanger le code contre un token
  const { tokens } = await oauth2Client.getToken(code);
  
  // Stocker les tokens en base de données (encryptés)
  await db.businesses.updateTokens(businessId, {
    accessToken: encrypt(tokens.access_token),
    refreshToken: encrypt(tokens.refresh_token),
    expiryDate: tokens.expiry_date,
  });

  // Rediriger vers le dashboard
  return Response.redirect('/dashboard');
}
```

## 📊 Architecture de Base de Données

```sql
-- Table des établissements clients
CREATE TABLE businesses (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  google_business_id VARCHAR(255),
  sector VARCHAR(100), -- 'restaurant', 'salon', etc.
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  auto_publish BOOLEAN DEFAULT false,
  preferred_tone VARCHAR(50),
  created_at TIMESTAMP
);

-- Table des avis
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  google_review_id VARCHAR(255) UNIQUE,
  text TEXT,
  rating INTEGER,
  author_name VARCHAR(255),
  response_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  google_created_at TIMESTAMP
);

-- Table des réponses
CREATE TABLE review_responses (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  generated_response TEXT,
  final_response TEXT, -- Peut être modifiée par le client
  status VARCHAR(50), -- 'draft', 'pending', 'published'
  published_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## 🔄 Workflow Complet

### Scénario 1 : Publication Automatique

```
1. Client reçoit un avis → Google envoie webhook
2. Votre serveur détecte le nouvel avis
3. IA génère une réponse personnalisée
4. Réponse publiée automatiquement sur Google (si auto-publish activé)
5. Notification envoyée au client (email/SMS)
```

### Scénario 2 : Validation Manuelle

```
1. Client reçoit un avis → Google envoie webhook
2. Votre serveur détecte le nouvel avis
3. IA génère une réponse personnalisée
4. Réponse mise en "brouillon" en base de données
5. Email envoyé au client : "Nouvel avis - Validez la réponse"
6. Client se connecte au dashboard
7. Client voit l'avis + réponse suggérée
8. Client approuve/modifie la réponse
9. Réponse publiée sur Google
```

## 🛠️ Implémentation dans Next.js

### API Route pour Webhook

```typescript
// app/api/webhooks/google-reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { processNewReview } from "@/lib/review-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Vérifier la signature Google (sécurité)
    const isValid = verifyGoogleSignature(body, request.headers);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Traiter le nouvel avis
    if (body.eventType === 'NEW_REVIEW') {
      await processNewReview(body.review, body.businessId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### Cron Job pour Polling (Alternative)

```typescript
// app/api/cron/check-reviews/route.ts
import { cron } from "@/lib/cron";
import { pollNewReviews } from "@/lib/poll-reviews";

// Exécuter toutes les 5 minutes
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  // Sécurité : vérifier que la requête vient de votre cron service
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupérer tous les établissements actifs
  const businesses = await db.businesses.findActive();
  
  for (const business of businesses) {
    await pollNewReviews(business.id);
  }

  return NextResponse.json({ success: true });
}
```

## 🔑 APIs Nécessaires

### 1. Google Business Profile API
- **Endpoint** : `https://mybusiness.googleapis.com/v4/`
- **Authentification** : OAuth 2.0
- **Permissions** : Accès en lecture/écriture aux avis
- **Documentation** : https://developers.google.com/my-business/content/overview

### 2. OpenAI API
- **Endpoint** : `https://api.openai.com/v1/chat/completions`
- **Modèle recommandé** : GPT-4 (meilleure qualité) ou GPT-3.5-turbo (moins cher)
- **Coût** : ~0.01-0.03€ par réponse générée

### Alternative : Anthropic Claude
- **Endpoint** : `https://api.anthropic.com/v1/messages`
- **Modèle** : Claude 3 Sonnet
- **Avantages** : Meilleur pour le français, plus long contexte

## 🔒 Sécurité

1. **Tokens OAuth** : Stocker encryptés dans la base de données
2. **Refresh Tokens** : Gérer le renouvellement automatique
3. **Webhooks** : Vérifier la signature Google
4. **API Keys IA** : Variables d'environnement sécurisées
5. **Rate Limiting** : Limiter les appels API

## 💰 Coûts Approximatifs

**Par établissement/mois :**
- Google API : Gratuit (dans les limites)
- OpenAI GPT-4 : ~0.02€ × nombre d'avis (ex: 50 avis = 1€/mois)
- Infrastructure serveur : ~5-10€/mois
- Base de données : ~3-5€/mois

**Total : ~10-15€/mois par établissement** (si 50 avis/mois)

## 📝 Checklist d'Implémentation

- [ ] Créer compte Google Cloud Project
- [ ] Activer Google Business Profile API
- [ ] Configurer OAuth 2.0 credentials
- [ ] Créer compte OpenAI / Anthropic
- [ ] Mettre en place la base de données
- [ ] Implémenter l'authentification OAuth
- [ ] Créer le système de polling/webhooks
- [ ] Intégrer l'IA pour générer les réponses
- [ ] Créer le dashboard client
- [ ] Implémenter la publication automatique
- [ ] Tester avec de vrais avis Google

## 🚀 Prochaines Étapes

1. **Phase 1** : POC (Proof of Concept)
   - Tester avec 1-2 établissements
   - Vérifier le fonctionnement end-to-end

2. **Phase 2** : Beta
   - 10-20 établissements
   - Recueillir les retours

3. **Phase 3** : Production
   - Scaling
   - Optimisation des coûts
   - Dashboard complet





