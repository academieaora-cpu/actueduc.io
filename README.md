# edu-news — Application d'actualités sur l'éducation

Version minimaliste prête pour GitHub Pages (frontend statique) et backend Node optionnel.

Published:
- Frontend build statique dans /docs pour GitHub Pages (https://academieaora-cpu.github.io/actueduc.io)

Backend:
- Le backend dans /server est optionnel. Il permet de proxyfier les appels vers NewsAPI (nécessite une clé NEWSAPI_KEY).

Instructions rapides:
1. Clone le repo :
   git clone git@github.com:academieaora-cpu/actueduc.io.git
   cd actueduc.io

2. Builder le frontend :
   cd client
   npm install
   npm run build   # génère /docs

3. Commit & push :
   cd ..
   git add docs
   git commit -m "Build: static frontend for GitHub Pages"
   git push origin main

4. Activer GitHub Pages dans Settings -> Pages : Branch = main, Folder = /docs

Backend (local) :
cd server
npm install
cp .env.example .env    # mettre NEWSAPI_KEY dans .env
npm start

Notes :
- GitHub Pages ne peut pas exécuter le backend. Pour avoir l'API en production, il faudra déployer /server sur Render/Railway/Fly etc.
