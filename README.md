# Orpheus — Portfolio

Portfolio personnel d'Orpheus, développeur web indépendant. Site statique, responsive et sans étape de build : HTML, CSS et JavaScript natifs.

## URL publiques

- **GitHub Pages (en ligne)** : <https://awashalt3-ux.github.io/portfolio/>
- **Wasmer Edge (cible)** : <https://orpheus-web.wasmer.app/>

Le site est déployé automatiquement sur GitHub Pages à chaque push sur `main`, via `.github/workflows/pages.yml`.

## Structure

```
.
├── .github/workflows/
│   └── pages.yml         # Déploiement automatique sur GitHub Pages
├── app.yaml              # Configuration de l'app Wasmer Edge
├── Staticfile            # Racine servie par Static Web Server (public)
├── wasmer.toml           # Manifeste du package Wasmer
├── settings/
│   └── config.toml       # En-têtes, cache, page 404
├── scripts/
│   └── set-site-url.mjs  # Change l'URL publique du site
└── public/               # Fichiers réellement servis
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── 404.html
    ├── robots.txt
    ├── sitemap.xml
    ├── site.webmanifest
    └── assets/
```

## Lancer en local

Depuis la racine du projet :

```bash
python -m http.server 8000 --directory public
```

Puis ouvre <http://localhost:8000>.

Il est aussi possible d'ouvrir directement `public/index.html` dans un navigateur, mais un serveur local évite les restrictions liées au protocole `file://`.

## Déployer sur Wasmer Edge

Le projet est prêt pour Wasmer Edge (`app.yaml`, `Staticfile`, `wasmer.toml`).

1. Installer le CLI Wasmer (PowerShell) :

   ```powershell
   iwr https://win.wasmer.io -useb | iex
   ```

2. Se connecter :

   ```powershell
   wasmer login
   ```

3. Vérifier le nom de l'app dans `app.yaml` et le nom du package dans `wasmer.toml`. Ils doivent correspondre à ton compte Wasmer :

   ```yaml
   name: orpheus-web
   owner: awashalt3-ux
   ```

4. Déployer depuis la racine du projet :

   ```powershell
   wasmer deploy
   ```

L'URL attendue est <https://orpheus-web.wasmer.app>. Si le nom est déjà pris, Wasmer ajoute un suffixe ou te demande d'en choisir un autre.

Une fois le site déployé sur Wasmer, fais de cette adresse l'URL principale :

```bash
node scripts/set-site-url.mjs https://orpheus-web.wasmer.app
```

Le script met à jour `canonical`, `og:url`, `og:image`, `twitter:image`, `robots.txt`, `sitemap.xml` et la page 404. Commit et push ensuite les modifications.

### Mettre à jour l'URL du site manuellement

L'URL canonique et l'image Open Graph sont définies en absolu dans :

- `public/index.html` : `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD
- `public/robots.txt` : `Sitemap`
- `public/sitemap.xml` : `loc`
- `public/404.html` : liens de retour et favicon
- `public/site.webmanifest` : `start_url` (relatif, aucune modification nécessaire)

### Déploiement automatique depuis GitHub

Dans le dashboard Wasmer, ouvre l'app, puis **Git settings** et connecte le dépôt GitHub `awashalt3-ux/portfolio` sur la branche `main`. Les prochains pushs pourront être déployés depuis GitHub.

## Personnalisation

- `public/index.html` : textes, liens, prestations, FAQ et projets.
- `public/styles.css` : design, animations, couleurs et responsive.
- `public/script.js` : filtres projets, menu mobile, copie des coordonnées, progression de lecture et animations au scroll.
- `public/assets/` : favicon, icônes et image Open Graph.
- `public/assets/og-cover.svg` : source de l'image Open Graph. Le PNG utilisé par les réseaux sociaux est `public/assets/og-cover.png` (1200 × 630).

## Notes

- Les animations respectent le paramètre système « réduire les animations ».
- Le site reste lisible sans JavaScript ; les effets d'apparition sont ajoutés uniquement lorsque le navigateur les prend en charge.
- Le contenu des projets est basé sur les dépôts publics du compte GitHub `awashalt3-ux`.

## Contact

- E-mail : `webdevorpheus@gmail.com`
- GitHub : <https://github.com/awashalt3-ux>
- Discord : `kpasswd`

Le contenu éditorial et l'identité visuelle de ce portfolio sont personnels. Le code est publié à titre de démonstration.
