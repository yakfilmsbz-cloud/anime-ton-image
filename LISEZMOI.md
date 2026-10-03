# Anime ton image

Petit site qui transforme une image en vidéo avec Agnes (modèle gratuit Flash). Il tourne dans le navigateur, sans rien installer.

Il y a deux morceaux :
- `index.html` : le site (hébergé gratuitement sur GitHub Pages) ;
- `worker.js` : un petit relais gratuit (Cloudflare Workers). Il est nécessaire parce qu'un navigateur n'a pas le droit d'appeler directement Agnes.

## Mise en ligne (une seule fois, environ 10 minutes)

### A. Le relais Cloudflare
1. Crée un compte gratuit sur cloudflare.com, puis va dans « Workers & Pages » > « Create » > « Create Worker », donne-lui un nom (ex. `anime-relais`) et clique « Deploy ».
2. Clique « Edit code », efface tout, colle le contenu de `worker.js`.
3. En haut du fichier, remplace `https://TON-PSEUDO.github.io` par l'adresse exacte de ton futur site GitHub Pages (voir B). Clique « Deploy ».
4. Note l'adresse du relais, du genre `https://anime-relais.TONCOMPTE.workers.dev`.

### B. Le site sur GitHub
1. Crée un dépôt public (ex. `anime-ton-image`) et mets-y `index.html`, `logo.png`, `favicon.png` et `LISEZMOI.md`.
2. Dans `index.html`, remplace `https://REMPLACE-MOI.workers.dev` par l'adresse du relais (étape A.4).
3. Dans le dépôt : Settings > Pages > « Deploy from a branch » > `main` / `/ (root)` > Save.
4. Le site est en ligne sur `https://TON-PSEUDO.github.io/anime-ton-image/`. Utilise la partie `https://TON-PSEUDO.github.io` (sans le nom du dépôt) dans `worker.js`.

Si tu changes l'adresse du site, pense à mettre à jour `SITE` dans le relais.

## À savoir
- Les clés API des utilisateurs passent par ton relais pour arriver chez Agnes. Il ne les garde pas et n'écrit aucun journal, mais dis-le honnêtement si on te pose la question (le code du relais est lisible ici).
- Le plan gratuit de Cloudflare permet 100 000 appels par jour, largement assez.
- Chaque utilisateur utilise sa propre clé Agnes, donc ses propres limites gratuites.
