Mission Action - Revue & Boutique en Ligne
Bienvenue sur le dépôt GitHub de Mission Action, une plateforme web moderne conçue pour la vente des numéros de la revue Mission Action. Ce projet intègre une boutique en ligne performante avec un back-office de gestion de contenu (CMS) puissant pour une administration simple et efficace.

✨ Fonctionnalités Principales
🛒 Boutique en Ligne Complète : Parcourez les différents numéros de la revue, ajoutez-les au panier et procédez au paiement de manière fluide et sécurisée.

💳 Intégration de Paiement Stripe : Système de paiement robuste et sécurisé pour gérer les transactions.

📬 Envoi Automatisé d'Emails : Après chaque achat, un email de confirmation est automatiquement envoyé au client via Resend, avec le numéro de la revue acheté en pièce jointe (PDF).

🚀 Performances optimisées : Construit avec Next.js, le site offre des temps de chargement rapides et un excellent référencement naturel (SEO).

✍️ Gestion de Contenu Simplifiée : Le contenu du site (produits, textes, images) est entièrement géré via Sanity.io, un CMS headless flexible et intuitif.

🎨 Design Moderne et Adaptatif : L'interface est développée avec Tailwind CSS, garantissant une expérience utilisateur agréable sur tous les appareils (ordinateurs, tablettes, mobiles).

🔒 Webhooks Sécurisés : Utilisation de webhooks Stripe pour gérer les événements de paiement de manière fiable et sécurisée, déclenchant l'envoi des produits numériques.

🛠️ Technologies Utilisées
Ce projet est construit avec un ensemble de technologies modernes et performantes :

Framework Front-end : Next.js (React)

Styling : Tailwind CSS

Gestion de Contenu (CMS) : Sanity.io

Paiement en Ligne : Stripe

Envoi d'Emails Transactionnels : Resend

Langage : TypeScript

🚀 Démarrage Rapide
Suivez ces étapes pour lancer le projet sur votre machine locale.

1. Prérequis
Assurez-vous d'avoir installé les éléments suivants :

Node.js (version 18.x ou supérieure)

npm ou yarn

2. Installation
Clonez le dépôt :

git clone https://github.com/devmissionaction/MissionAction.git
cd MissionAction

Installez les dépendances :

npm install
# ou
yarn install

3. Configuration de l'environnement
Créez un fichier .env.local à la racine du projet en copiant le modèle .env.example (s'il existe) ou en créant un nouveau fichier.

Ajoutez les variables d'environnement suivantes dans votre fichier .env.local avec vos propres clés d'API :

# Clés publiques (utilisables côté client)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_URL=http://localhost:3000

# Clés secrètes (uniquement côté serveur)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
SANITY_API_TOKEN=...

Stripe : Vous trouverez vos clés dans votre Dashboard Stripe.

Sanity : Les informations du projet sont disponibles dans votre Dashboard Sanity. Le token d'API doit avoir les permissions de lecture.

Resend : La clé d'API se trouve dans votre Dashboard Resend.

4. Lancer le serveur de développement
Une fois l'installation et la configuration terminées, lancez le serveur :

npm run dev
# ou
yarn dev

Ouvrez http://localhost:3000 dans votre navigateur pour voir l'application.

🤝 Contribution
Les contributions sont les bienvenues ! Si vous souhaitez améliorer le projet, n'hésitez pas à forker le dépôt et à créer une Pull Request.

Forkez le projet.

Créez votre branche de fonctionnalité (git checkout -b feature/NouvelleFonctionnalite).

Commitez vos changements (git commit -m 'Ajout de NouvelleFonctionnalite').

Pushez vers la branche (git push origin feature/NouvelleFonctionnalite).

Ouvrez une Pull Request.