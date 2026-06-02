import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: 'Adam Slamen — Creative Developer & UX Designer',
  description: 'Portfolio of Adam Slamen — Creative Developer & UX Designer. Next.js, GSAP, Three.js, UX Design.',
  openGraph: {
    title: 'Adam Slamen — Creative Developer',
    description: 'Creative Developer & UX Designer — Slovakia · Denmark · Digital',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
