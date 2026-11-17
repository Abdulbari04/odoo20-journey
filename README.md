# خريطة أودو 20 — Odoo 20 Journey
React 19 + TypeScript + Vite. Static site, no backend.

## Run locally
npm install && npm run dev

## Build
npm run build   # output in dist/

## Publish (pick one)
1. Netlify Drop: open app.netlify.com/drop and drag the `dist` folder. Done, you get a public link.
2. GitHub Pages: push this folder to a GitHub repo (branch main), then Settings > Pages > Source = GitHub Actions. The workflow in .github/workflows/deploy.yml builds and deploys automatically.
3. Vercel: import the repo, framework Vite, defaults.

Content lives in src/data.json (chapters + Odoo 20 vs 19 changes). Styles in src/styles.css.

## Online database on GitHub Pages (optional, Supabase)
1. Create a free project at supabase.com, then run `supabase.sql` in SQL Editor.
2. Authentication > Providers > Email: for easy sign-up turn off "Confirm email".
3. In the GitHub repo: Settings > Secrets and variables > Actions > Variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the public anon key only).
4. Push to main. Without these variables the site falls back to browser localStorage.
