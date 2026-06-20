import type { Metadata } from 'next'
import { Sora, Bebas_Neue, Noto_Sans_JP, Press_Start_2P, VT323 } from 'next/font/google'
import './globals.css'
import { CRTProvider } from '@/lib/crt-context'
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

/* Legacy CRT fonts — kept so old components render correctly */
const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'swap',
})

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Suhas Chowdary | Portfolio',
  description: 'AI Engineer & Full Stack Developer — building things that think.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`
        ${sora.variable}
        ${bebas.variable}
        ${notoJP.variable}
        ${pressStart.variable}
        ${vt323.variable}
      `}
    >
      <body className="min-h-dvh bg-bg-deep text-text overflow-x-hidden">
        <CRTProvider>
          <NavRail />
          {children}
        </CRTProvider>
      </body>
    </html>
  )
}
