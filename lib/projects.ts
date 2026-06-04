export type Project = {
  id: string
  num: string
  category: string
  title: string
  description: string
  tags: string[]
  url: string
  screenshotA: string
  screenshotB: string
  // Portrait screenshots for iPhone-framed (mobile-first) projects:
  mobileA?: string
  mobileB?: string
  device: 'browser' | 'iphone'   // how the project is shown in the reel
  group: string                  // category band in the reel
  bg: string
  fallbackFrom: string
  fallbackTo: string
  featured: boolean
}

// NOTE: the order of this array IS the order of the reel (FEATURED keeps array order).
// Reel order: WEB DESIGN -> APPS -> TOOLS
export const PROJECTS: Project[] = [
  {
    id: 'laya', num: '01', category: 'Portfolio Design', title: 'LAYA HOME',
    description: 'Editorial portfolio for a Czech architecture & interior design studio. ScrollTrigger card reveals, Lenis smooth scroll, 21-project showcase grid.',
    tags: ['GSAP', 'Lenis', 'Interior', 'Editorial'],
    url: 'https://laya2.vercel.app',
    screenshotA: '/screenshots/02a.jpg', screenshotB: '/screenshots/02b.jpg',
    device: 'browser', group: 'Web Design',
    bg: 'linear-gradient(160deg,#080d0a 60%,#0c1610 100%)',
    fallbackFrom: '#8B9E8A', fallbackTo: '#5A7059', featured: true,
  },
  {
    id: 'naturhistorisk', num: '02', category: 'Brand System', title: 'Naturhistorisk Museum',
    description: 'Web redesign constrained to a strict museum brand system. Survival Kingdom — typography-led, accessibility-first, Copenhagen.',
    tags: ['Brand System', 'UX/UI', 'Museum', 'Danish'],
    url: 'https://survivalkingdom.vercel.app',
    screenshotA: '/screenshots/04a.jpg', screenshotB: '/screenshots/04b.jpg',
    device: 'browser', group: 'Web Design',
    bg: 'linear-gradient(160deg,#0c0a06 60%,#181206 100%)',
    fallbackFrom: '#3D2E1A', fallbackTo: '#5C4A2A', featured: true,
  },
  {
    id: 'trail', num: '03', category: 'React App', title: 'Trail Matcher',
    description: 'Personalised trail recommendation for High Tatras visitors. Quiz-based algorithm matching 24 real trails to fitness and experience level.',
    tags: ['React', 'Supabase', 'GSAP', 'Mobile-first'],
    url: 'https://trail-matcher.vercel.app',
    screenshotA: '/screenshots/03a.jpg', screenshotB: '/screenshots/03b.jpg',
    mobileA: '/screenshots/trail-1.jpg', mobileB: '/screenshots/trail-2.jpg',
    device: 'iphone', group: 'Apps',
    bg: 'linear-gradient(160deg,#080c12 60%,#0c1420 100%)',
    fallbackFrom: '#1a3a5e', fallbackTo: '#2C5F8A', featured: true,
  },
  {
    id: 'recipe', num: '04', category: 'Student Tool', title: 'Recipe Matcher',
    description: 'Smart recipe discovery for students. Ingredient-based matching with budget filtering and nutritional awareness.',
    tags: ['React', 'Algorithm', 'Mobile-first', 'Food'],
    url: 'https://recipes-ruddy-eight.vercel.app',
    screenshotA: '/screenshots/08a.jpg', screenshotB: '/screenshots/08b.jpg',
    mobileA: '/screenshots/recipe-1.jpg', mobileB: '/screenshots/recipe-2.jpg',
    device: 'iphone', group: 'Apps',
    bg: 'linear-gradient(160deg,#0c0e08 60%,#141808 100%)',
    fallbackFrom: '#2a3e1a', fallbackTo: '#4A6741', featured: true,
  },
  {
    id: 'palette', num: '05', category: 'Design Tool', title: 'PALETTE',
    description: 'Image colour extraction tool. Canvas API pixel sampling, Median Cut quantization, export as CSS variables or Figma tokens.',
    tags: ['Canvas API', 'Algorithm', 'TypeScript', 'Design Tool'],
    url: 'https://placeholder-palette.vercel.app',
    screenshotA: '/screenshots/11a.jpg', screenshotB: '/screenshots/11b.jpg',
    device: 'browser', group: 'Tools',
    bg: 'linear-gradient(160deg,#0c0a14 60%,#16102a 100%)',
    fallbackFrom: '#1a1a3e', fallbackTo: '#3a2060', featured: true,
  },
  {
    id: 'waveform', num: '06', category: 'Web Audio', title: 'WAVEFORM',
    description: 'Music player with audio-reactive visualiser. Web Audio API, frequency analysis, canvas animations that respond to the music in real time.',
    tags: ['Web Audio API', 'Canvas', 'TypeScript', 'Music'],
    url: 'https://placeholder-waveform.vercel.app',
    screenshotA: '/screenshots/10a.jpg', screenshotB: '/screenshots/10b.jpg',
    device: 'browser', group: 'Tools',
    bg: 'linear-gradient(160deg,#0a0a1e 60%,#13082a 100%)',
    fallbackFrom: '#0a0a2e', fallbackTo: '#1a0a3e', featured: true,
  },

  // ── Not in the reel — shown in the "More work" grid below ──
  {
    id: 'nova', num: '07', category: 'Brand & Three.js', title: 'NOVA Phone',
    description: 'Fictional premium phone brand. Three.js 3D product visualisation, animated statistics counter, immersive scroll-driven hero experience.',
    tags: ['Three.js', 'JavaScript', '3D Visual', 'Brand'],
    url: 'https://nova-chi-blush.vercel.app',
    screenshotA: '/screenshots/01a.jpg', screenshotB: '/screenshots/01b.jpg',
    device: 'browser', group: 'Web Design',
    bg: 'linear-gradient(160deg,#080818 60%,#0e0e28 100%)',
    fallbackFrom: '#0a0a2e', fallbackTo: '#1a0a3e', featured: false,
  },
  {
    id: 'spilcafe', num: '08', category: 'Full-stack', title: 'SpilCafe',
    description: 'Full-stack game café management system. Firebase auth, real-time session tracking and booking management for hospitality venues.',
    tags: ['Firebase', 'Auth', 'Full-stack', 'Real-time'],
    url: 'https://spilcafee-management.vercel.app',
    screenshotA: '/screenshots/05a.jpg', screenshotB: '/screenshots/05b.jpg',
    device: 'browser', group: 'Apps',
    bg: 'linear-gradient(160deg,#080a10 60%,#0c1020 100%)',
    fallbackFrom: '#0a1428', fallbackTo: '#1A3A5C', featured: false,
  },
  {
    id: 'ecosort', num: '09', category: 'CMS App', title: 'EcoSort',
    description: 'Smart recycling guide powered by Sanity CMS. Real-time content management with clean, purposeful UI design.',
    tags: ['Sanity CMS', 'React', 'Sustainability'],
    url: 'https://eco-sort-psi.vercel.app',
    screenshotA: '/screenshots/06a.jpg', screenshotB: '/screenshots/06b.jpg',
    device: 'browser', group: 'Apps',
    bg: 'linear-gradient(135deg,#1a3a22,#2D5A3D)',
    fallbackFrom: '#1a3a22', fallbackTo: '#2D5A3D', featured: false,
  },
  {
    id: 'museumquiz', num: '10', category: 'Kiosk UI', title: 'Museum Quiz',
    description: 'Touch-screen quiz for museum kiosk deployment. Bilingual DK/EN, large touch targets, gamified learning flow.',
    tags: ['Touch UI', 'Kiosk', 'Bilingual', 'Gamified'],
    url: 'https://quiz-nu-henna.vercel.app',
    screenshotA: '/screenshots/07a.jpg', screenshotB: '/screenshots/07b.jpg',
    device: 'browser', group: 'Apps',
    bg: 'linear-gradient(135deg,#2a1a3e,#6B4C8A)',
    fallbackFrom: '#2a1a3e', fallbackTo: '#6B4C8A', featured: false,
  },
  {
    id: 'brickbreaker', num: '11', category: 'Game Dev', title: 'BrickBreaker',
    description: 'Browser-based arcade game. Physics engine, collision detection and gravity system built from scratch with Canvas API.',
    tags: ['Canvas API', 'Physics', 'Game Dev', 'Vanilla JS'],
    url: 'https://newgame-xi.vercel.app',
    screenshotA: '/screenshots/09a.jpg', screenshotB: '/screenshots/09b.jpg',
    device: 'browser', group: 'Game',
    bg: 'linear-gradient(135deg,#2e0808,#8A2B2B)',
    fallbackFrom: '#2e0808', fallbackTo: '#8A2B2B', featured: false,
  },
]

export const FEATURED = PROJECTS.filter(p => p.featured)
export const MORE_WORK = PROJECTS.filter(p => !p.featured)
