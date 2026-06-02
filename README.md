# Adam Slamen — Portfolio

Creative Developer & UX Designer portfolio. Built with Next.js 16, GSAP, Three.js, Lenis.

## Tech Stack
- **Next.js 16** (App Router)
- **React 19 / TypeScript** (strict)
- **GSAP 3.15** + ScrollTrigger
- **Lenis 1.3** smooth scroll (synced to GSAP ticker)
- **Three.js 0.184** (hero particle constellation)

## Before deploying — fill in your details

### 1. Add your email and social links
Open `components/Contact.tsx` and replace:
- `your@email.com` with your real email (appears twice — href and display text)
- The `#` placeholders for GitHub, LinkedIn, Instagram

### 2. Add WAVEFORM and PALETTE URLs
Open `lib/projects.ts` and replace:
- `https://placeholder-waveform.vercel.app` with your real WAVEFORM URL
- `https://placeholder-palette.vercel.app` with your real PALETTE URL

### 3. Add screenshots (see below)

---

## Screenshot naming — exactly as listed

Place all screenshots in `public/screenshots/`:

```
public/screenshots/
  01a.jpg  ← NOVA · hero / 3D view
  01b.jpg  ← NOVA · second view
  02a.jpg  ← LAYA HOME · landing
  02b.jpg  ← LAYA HOME · project grid
  03a.jpg  ← Trail Matcher · landing/quiz
  03b.jpg  ← Trail Matcher · results
  04a.jpg  ← Naturhistorisk · hero
  04b.jpg  ← Naturhistorisk · interior
  05a.jpg  ← SpilCafe · dashboard/login
  05b.jpg  ← SpilCafe · management view
  06a.jpg  ← EcoSort · landing
  06b.jpg  ← EcoSort · sorting guide
  07a.jpg  ← Museum Quiz · start screen
  07b.jpg  ← Museum Quiz · quiz in action
  08a.jpg  ← Recipe Matcher · landing
  08b.jpg  ← Recipe Matcher · results
  09a.jpg  ← BrickBreaker · game view
  09b.jpg  ← BrickBreaker · second view
  10a.jpg  ← WAVEFORM · player view
  10b.jpg  ← WAVEFORM · second view
  11a.jpg  ← PALETTE · empty state / drop zone
  11b.jpg  ← PALETTE · palette extracted
```

**How to take screenshots:**
Open each URL in Chrome → DevTools (Cmd+Option+I) → Cmd+Shift+P → "Capture screenshot"

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Framework: Next.js (auto-detected)
4. Deploy — done

No environment variables needed.
