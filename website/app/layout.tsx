import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { I18nProvider } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "FinSage MCP - Chart Gallery",
  description: "Servidor MCP que conecta tu asistente de IA con datos financieros en tiempo real via Finnhub API.",
  keywords: ["FinSage", "MCP", "AI", "finanzas", "inversión", "datos financieros", "Finnhub"],
  authors: [{ name: "FinSage Team" }],
  openGraph: {
    title: "FinSage MCP - Superpoderes Financieros para tu Asistente de IA",
    description: "Servidor MCP que conecta tu asistente de IA con datos financieros en tiempo real",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
