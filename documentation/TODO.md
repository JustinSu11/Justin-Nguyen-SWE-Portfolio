# Portfolio — Actionable Tasks

## Completed
- [x] Next.js project setup (TypeScript, Tailwind, ESLint)
- [x] Git flow configured (master/develop branches), connected to GitHub
- [x] Hero section (Framer Motion animations, name, tagline, CTA buttons)
- [x] About section (bio copy, stats pills, avatar placeholder)
- [x] Projects section (3 cards: BeautyByAmy, Charles, ClutchCall — layout, animations, tech tags)
- [x] Skills section (scrolling carousel + wireframe globe)
- [x] Contact section (email, GitHub, LinkedIn links, footer)
- [x] Guestbook section (UI complete with form + masonry grid)
- [x] Chat widget component
- [x] Custom cursor component
- [x] Framer Motion chosen and implemented
- [x] Vercel Analytics integrated
- [x] SEO title + description set in layout.tsx
- [x] Custom fonts (Space Grotesk, JetBrains Mono, Sora)
- [x] Favicon/icons configured

## Immediate (Next Session)
- [ ] Add actual LinkedIn profile URL (currently placeholder `https://linkedin.com`)
- [ ] Add project screenshots to `/public/images/` (beautybyamy.jpg, charles.jpg, clutchcall.jpg)
- [ ] Add resume PDF to `/public/` and wire up download button in hero or contact section
- [ ] Build responsive navigation bar (sticky, smooth scroll to sections)

## Short-Term
- [ ] Persist guestbook messages (currently in-memory, resets on refresh) — needs API route + DB or a service like PlanetScale / Supabase
- [ ] Add dark mode toggle (currently hardcoded to dark in layout.tsx)
- [ ] Add Marine Corps background to About bio
- [ ] Add og:image for social sharing previews
- [ ] Add sitemap.xml and robots.txt

## Pre-Deployment
- [ ] Test responsive design on real mobile/tablet devices
- [ ] Accessibility audit (WCAG 2.1 AA — semantic HTML, ARIA labels)
- [ ] Lighthouse score > 90 (performance, accessibility, SEO)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Zero console errors/warnings

## Deployment
- [ ] Deploy to Vercel
- [ ] Custom domain setup (justinnguyen.dev or similar)
- [ ] SSL and DNS configuration
- [ ] Verify Vercel Analytics is tracking after deploy

## Open Decisions
- [ ] Custom domain name (justinnguyen.dev, jnguyen.dev, other?)
- [ ] Guestbook persistence solution (Supabase, PlanetScale, Upstash, or remove feature?)
- [ ] Include blog section in MVP or defer to v2?
