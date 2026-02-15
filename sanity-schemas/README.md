# Schémas Sanity – Le Festival

Ces schémas permettent d’alimenter la page **Le Festival** depuis Sanity.

## Fichiers

- **festivalPage.ts** – Document singleton pour la page (hero, présentation, affiche, programme, inscription).
- **festivalPartner.ts** – Document pour chaque partenaire (nom, logo, lien, ordre).

## Intégration dans Sanity Studio

1. Copiez les fichiers dans le dossier `schemas` de votre projet Sanity (ou équivalent).
2. Enregistrez les schémas dans votre configuration, par exemple dans `sanity.config.ts` :

```ts
import festivalPage from './schemas/festivalPage'
import festivalPartner from './schemas/festivalPartner'

export default defineConfig({
  // ...
  schema: {
    types: [
      // ... vos types existants
      festivalPage,
      festivalPartner,
    ],
  },
})
```

3. Dans le Studio, créez un document **Page Le Festival** (type `festivalPage`) et autant de documents **Partenaire Festival** que nécessaire.

## Champs de la page Festival

| Champ            | Rôle |
|------------------|------|
| Image hero       | Image en haut de la page |
| Présentation     | Texte riche à côté de l’affiche |
| Affiche          | Image de l’affiche du festival |
| Programme        | Texte riche pour le programme |
| Lien d’inscription | URL du formulaire (Google Form, etc.) |
| Texte du bouton  | Libellé du bouton d’inscription |

## Partenaires

Chaque partenaire a : **nom**, **logo** (image), **site web** (optionnel), **ordre** d’affichage. La section Partenaires n’apparaît que s’il existe au moins un partenaire.
