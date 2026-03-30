// src/app/layout.tsx
import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "AlgoViz - Algoritmos Visualizados",
  description: "Plataforma de visualizacoes interativas de algoritmos em portugues",
  keywords: ["algoritmos", "visualizacao", "entrevistas", "programacao"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
