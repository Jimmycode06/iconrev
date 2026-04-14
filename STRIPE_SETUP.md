# Configuration Stripe Checkout

Ce guide vous explique comment configurer Stripe Checkout pour votre site e-commerce.

## 📋 Prérequis

1. Un compte Stripe (gratuit) : https://dashboard.stripe.com/register
2. Accès au mode test et production

## 🔑 Étape 1 : Obtenir vos clés API

1. Allez sur https://dashboard.stripe.com/apikeys
2. Vous verrez deux clés :
   - **Clé secrète** (commence par `sk_test_...` ou `sk_live_...`)
   - **Clé publique** (commence par `pk_test_...` ou `pk_live_...`)

## 🔧 Étape 2 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici

# Webhook Secret (pour la production uniquement)
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook

# URL de votre application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important** : Ne commitez JAMAIS le fichier `.env.local` (il est déjà dans `.gitignore`)

## 🧪 Étape 3 : Tester en mode développement

1. Utilisez les clés de **test** (commençant par `sk_test_` et `pk_test_`)
2. Utilisez la carte de test : `4242 4242 4242 4242`
   - Date d'expiration : n'importe quelle date future (ex: 12/25)
   - CVC : n'importe quel 3 chiffres (ex: 123)
   - Code postal : n'importe quel code postal valide (ex: 75001)

## 🌐 Étape 4 : Configurer les webhooks (production)

### En développement local avec Stripe CLI :

1. Installez Stripe CLI : https://stripe.com/docs/stripe-cli
2. Connectez-vous : `stripe login`
3. Écoutez les webhooks : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copiez le secret webhook affiché et ajoutez-le à `.env.local`

### En production :

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Événements à sélectionner :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiez le "Secret de signature" et ajoutez-le à vos variables d'environnement

## 🔄 Comment ça fonctionne

1. **Client clique sur "Passer au paiement"**
   - Votre site crée une session Stripe via `/api/checkout`

2. **Client redirigé vers Stripe**
   - Page sécurisée Stripe pour saisir :
     - Adresse de livraison
     - Coordonnées
     - Carte bancaire

3. **Paiement réussi**
   - Stripe redirige vers `/checkout/success`
   - Votre page affiche les détails de la commande

4. **Webhook reçu**
   - Stripe envoie une notification à `/api/webhooks/stripe`
   - Vous pouvez enregistrer la commande dans votre base de données
   - Envoyer un email de confirmation
   - Notifier votre équipe logistique

## 📦 Données collectées automatiquement

Stripe collecte automatiquement :
- ✅ Email du client
- ✅ Adresse de livraison complète
- ✅ Numéro de téléphone (optionnel)
- ✅ Informations de paiement (sécurisées)

## 🛠️ Personnalisation

### Modifier les pays de livraison

Dans `/app/api/checkout/route.ts`, modifiez :

```typescript
shipping_address_collection: {
  allowed_countries: ["FR", "BE", "CH"], // Vos pays
}
```

### Ajouter des métadonnées personnalisées

Dans `/app/api/checkout/route.ts`, ajoutez dans `metadata` :

```typescript
metadata: {
  order_source: "website",
  customer_id: "custom_id_here",
}
```

## 📊 Voir les paiements

- Mode test : https://dashboard.stripe.com/test/payments
- Mode production : https://dashboard.stripe.com/payments

## 🆘 Problèmes courants

### Erreur : "STRIPE_SECRET_KEY is not set"
➡️ Vérifiez que votre fichier `.env.local` existe et contient la clé

### Le webhook ne fonctionne pas en local
➡️ Utilisez Stripe CLI pour forwarder les webhooks

### L'adresse n'est pas collectée
➡️ Vérifiez que `shipping_address_collection` est bien configuré dans `/app/api/checkout/route.ts`

## 🔗 Ressources

- [Documentation Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Guide des webhooks](https://stripe.com/docs/webhooks)
- [Cartes de test Stripe](https://stripe.com/docs/testing)





