# Munil Sir — Study Platform Clone

A clone of [study.munilsir.com](https://study.munilsir.com) built for Vercel deployment.

- **No authentication** required
- **No batch purchase** section
- Pulls course data & videos from the original backend
- Beautiful, responsive SPA frontend

## 🚀 Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Deploy — zero config needed
4. Add custom domain `munilsir.asmultiverse.in` in Vercel project settings

## 🌐 Custom Domain Setup

In your DNS provider, add:
```
CNAME  munilsir  cname.vercel-dns.com
```

## 📁 Structure

```
├── vercel.json          # Vercel config (rewrites, headers)
├── package.json         # Dependencies
├── lib/
│   └── scraper.js       # Shared scraping/parsing logic
├── api/
│   ├── home.js          # GET /api/home
│   ├── courses.js       # GET /api/courses
│   ├── free-courses.js  # GET /api/free-courses
│   └── course/
│       └── [slug].js    # GET /api/course/:slug
└── public/
    ├── index.html       # SPA shell
    ├── style.css        # Premium styling
    └── app.js           # SPA routing + rendering
```

## Local Dev

```bash
npm i -g vercel
npm install
vercel dev
```
