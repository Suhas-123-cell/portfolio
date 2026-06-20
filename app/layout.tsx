import type { Metadata } from 'next'
import { Sora, Bebas_Neue, Noto_Sans_JP } from 'next/font/google'
import { MotionConfig } from 'motion/react'
import './globals.css'
import { NavRail } from '@/components/NavRail'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora-var',
  display: 'swap',
})

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-var',
  display: 'swap',
})

const notoJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-jp-var',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Suhas Chowdary | Portfolio',
  description: 'AI Engineer & Full Stack Developer — building things that think.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${bebas.variable} ${notoJP.variable}`}
    >
      <body className="min-h-dvh bg-bg-deep text-text overflow-x-hidden">
        {/* Skip to main content for keyboard users */}
        <a href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                     focus:px-4 focus:py-2 focus:rounded-lg focus:font-sora focus:text-sm"
          style={{ background: 'oklch(75% 0.18 185)', color: 'oklch(8% 0.025 240)' }}>
          Skip to content
        </a>
        {/* MotionConfig propagates reducedMotion to all motion.* elements sitewide */}
        <MotionConfig reducedMotion="user">
          <NavRail />
          {children}
        </MotionConfig>
      </body>
    </html>
  )
}
