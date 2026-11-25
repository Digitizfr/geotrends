import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// Le site public est ouvert aux moteurs de recherche.
// L'outil, derrière la connexion, ne l'est pas : voir (app)/layout.tsx et connexion/page.tsx.
export const metadata: Metadata = {
  metadataBase: new URL('https://geotrends.io'),
  title: 'GeoTrends',
  description: 'Logiciel GEO open source et gratuit : mesurer si les IA citent votre marque (ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google, Claude).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  )
}
