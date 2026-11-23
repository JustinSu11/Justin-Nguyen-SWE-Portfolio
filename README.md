# Justin Nguyen — Portfolio (v2.0, Next.js)

Static-export Next.js 15 + TypeScript site.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Structure
- `app/` layout, page, global CSS
- `components/` Backdrop, Nav, Accents, and one component per section
- `data/` typed content (projects, experience, stack, site, accents)
- `lib/scene.js` canvas orb, scroll snapping, hands, accent layout (untyped, to be split)
- `public/assets/images/` artwork

Deploy: import the repo in Vercel (framework auto-detected).
