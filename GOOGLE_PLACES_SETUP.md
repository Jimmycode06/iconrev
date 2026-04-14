# Configuration Google Places API

Ce guide vous explique comment configurer Google Places API pour la recherche d'établissements lors du checkout.

## 📋 Prérequis

1. Un compte Google Cloud Platform : https://console.cloud.google.com
2. Un projet Google Cloud créé
3. Google Places API activée

## 🔑 Étape 1 : Créer un projet Google Cloud

1. Allez sur https://console.cloud.google.com
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le nom de votre projet

## 🌐 Étape 2 : Activer Google Places API

1. Allez dans **APIs & Services** > **Library**
2. Recherchez "Places API"
3. Cliquez sur **Places API** et activez-la
4. Vous pouvez aussi activer **Places API (New)** si disponible

## 🔑 Étape 3 : Créer une clé API

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **+ CREATE CREDENTIALS** > **API Key**
3. Copiez votre clé API (commence par `AIza...`)

### Sécuriser votre clé API (Important !)

1. Cliquez sur votre clé API pour l'éditer
2. Dans **Application restrictions**, sélectionnez **HTTP referrers (web sites)**
3. Ajoutez vos domaines :
   ```
   http://localhost:3000/*
   https://votre-domaine.com/*
   https://*.votre-domaine.com/*
   ```
4. Dans **API restrictions**, sélectionnez **Restrict key**
5. Sélectionnez uniquement **Places API**
6. Sauvegardez

## ⚙️ Étape 4 : Configurer les variables d'environnement

Ajoutez dans votre `.env.local` :

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza_votre_cle_api_ici
```

⚠️ **Important** : 
- Utilisez `NEXT_PUBLIC_` pour que la clé soit accessible côté client
- Ne commitez JAMAIS le fichier `.env.local`

## 💰 Étape 5 : Comprendre les coûts

Google Places API a un système de facturation :
- **Gratuit** : 200€ de crédit par mois (environ 5000 requêtes Text Search)
- **Payant** : Après le quota gratuit, environ 0,032€ par requête Text Search

### Optimiser les coûts

1. Le code utilise un debounce de 500ms pour éviter trop de requêtes
2. Limite les résultats à 5 établissements maximum
3. Ne cherche que lorsque l'utilisateur tape (pas au chargement)

## 🧪 Tester la recherche

1. Allez sur `/checkout`
2. Tapez le nom d'un établissement (ex: "Restaurant Paris")
3. Vous devriez voir une liste de résultats

## 🔍 Comment ça fonctionne

1. **Client tape dans la recherche**
   - Le code attend 500ms (debounce)
   
2. **Appel à Google Places API**
   - Utilise `textSearch` pour trouver des établissements
   - Limite à 5 résultats
   
3. **Client sélectionne un établissement**
   - L'établissement est enregistré avec :
     - `place_id` : Identifiant unique Google
     - `name` : Nom de l'établissement
     - `formatted_address` : Adresse complète
   
4. **Informations passées à Stripe**
   - Stockées dans les métadonnées de la session Stripe
   - Accessibles via le webhook et la page de succès

## 🛠️ Personnalisation

### Changer le nombre de résultats

Dans `/app/checkout/page.tsx` :

```typescript
results.slice(0, 5) // Changez 5 pour le nombre souhaité
```

### Changer le délai de recherche (debounce)

```typescript
setTimeout(() => {
  // ... recherche
}, 500) // Changez 500 (ms) pour ajuster le délai
```

### Filtrer par type d'établissement

```typescript
const request = {
  query: searchQuery,
  type: "restaurant", // ou "cafe", "store", etc.
  // ...
}
```

## 📊 Voir les requêtes dans Google Cloud

1. Allez dans **APIs & Services** > **Dashboard**
2. Sélectionnez **Places API**
3. Vous verrez les statistiques d'utilisation

## 🆘 Problèmes courants

### Erreur : "This API project is not authorized to use this API"

➡️ Activez Places API dans votre projet Google Cloud

### Erreur : "RefererNotAllowedMapError"

➡️ Vérifiez que votre domaine est dans les restrictions HTTP referrers

### La recherche ne fonctionne pas

➡️ Vérifiez :
1. Que la clé API est correcte dans `.env.local`
2. Que Places API est activée
3. Que la clé a les bonnes restrictions
4. Ouvrez la console du navigateur pour voir les erreurs

### Trop de requêtes = coûts élevés

➡️ Augmentez le debounce (500ms → 1000ms) ou limitez les résultats

## 🔗 Ressources

- [Documentation Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Prix Google Places API](https://developers.google.com/maps/billing/understanding-cost-of-use)
- [Console Google Cloud](https://console.cloud.google.com)





