export const LOGO_PATH = "M3751 6697 c-147 -258 -265 -467 -461 -817 -349 -623 -436 -777 -575 -1025 -206 -367 -626 -1117 -685 -1225 -26 -47 -99 -177 -162 -290 -358 -642 -555 -994 -593 -1060 -23 -41 -56 -100 -73 -130 -45 -83 -368 -656 -507 -900 -67 -118 -175 -309 -240 -425 -65 -116 -146 -259 -180 -320 -123 -217 -275 -494 -275 -499 0 -3 152 -6 338 -6 l338 0 104 183 c139 244 303 535 355 627 22 41 121 217 219 390 163 287 435 771 558 995 28 50 69 124 93 165 23 41 109 194 190 340 82 146 321 573 533 950 212 377 488 870 615 1095 126 226 258 460 292 520 34 61 109 193 165 294 l103 183 14 -18 c7 -10 46 -77 85 -149 40 -71 136 -242 213 -380 158 -279 338 -598 423 -750 30 -55 77 -139 104 -186 26 -48 48 -91 48 -97 l0 -11 -492 -4 -493 -4 -68 -17 c-240 -57 -418 -155 -579 -317 l-87 -87 -54 -84 c-93 -142 -147 -267 -183 -423 l-19 -80 1 -170 1 -170 26 -97 c73 -267 229 -502 436 -659 132 -99 322 -181 496 -213 l80 -15 961 -1 962 0 77 -20 c96 -25 182 -68 262 -132 l63 -50 54 -81 c30 -45 64 -111 77 -147 l23 -65 0 -115 1 -115 -24 -74 -25 -75 -48 -73 c-27 -39 -75 -95 -106 -123 l-57 -51 -80 -38 c-44 -22 -112 -46 -152 -55 l-72 -16 -1654 0 -1655 0 -103 -183 c-159 -280 -219 -388 -219 -393 0 -2 1276 -4 2836 -4 l2836 0 -6 16 c-9 23 -188 344 -454 814 -337 595 -420 738 -467 800 -23 30 -76 108 -119 173 -89 136 -171 227 -276 307 -175 133 -325 206 -530 257 l-65 16 -1015 6 -1015 6 -65 22 c-96 33 -185 90 -251 161 l-59 63 -35 70 c-20 38 -42 95 -50 126 l-15 57 0 84 0 84 16 62 c50 193 200 353 394 419 l65 22 977 5 977 5 -140 250 c-78 138 -194 345 -258 460 -146 261 -565 1004 -761 1350 -272 480 -503 888 -627 1109 -68 121 -124 221 -126 222 -1 1 -71 -120 -156 -269z"

export const MARQUEE_ITEMS = [
  'Next.js 16','React 19','GSAP','Three.js','Supabase','Firebase',
  'Sanity CMS','TypeScript','Figma','Vercel','Lenis','UX Research',
  'Print Design','Canvas API','WebGL','Web Audio API',
]

// Flat list (kept for reference / any other consumers)
export const SKILLS = [
  'Next.js 16','React 19','TypeScript','GSAP','Three.js','ScrollTrigger',
  'Lenis','Supabase','Firebase','Sanity CMS','Vercel','Figma',
  'UX Research','Interaction Design','Print Design','Brand Systems',
  'CSS / SCSS','Canvas API','WebGL','Node.js','Git','Web Audio API',
]

// Grouped for the Skills section's reel + categorized layout
export const SKILL_CATEGORIES: { name: string; items: string[] }[] = [
  { name: 'Frontend',       items: ['Next.js 16', 'React 19', 'TypeScript', 'CSS / SCSS', 'Node.js'] },
  { name: 'Animation & 3D', items: ['GSAP', 'ScrollTrigger', 'Lenis', 'Three.js', 'WebGL', 'Canvas API', 'Web Audio API'] },
  { name: 'Backend & CMS',  items: ['Supabase', 'Firebase', 'Sanity CMS', 'Vercel', 'Git'] },
  { name: 'Design',         items: ['Figma', 'UX Research', 'Interaction Design', 'Print Design', 'Brand Systems'] },
]

export const MENU_IMAGES = {
  sezner: { pages: ['/menu-images/s1.jpg','/menu-images/s2.jpg','/menu-images/s3.jpg'] },
  tatraline: { pages: ['/menu-images/t1.jpg','/menu-images/t2.jpg'] },
}
