"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Locale = "es" | "en"

const translations = {
  es: {
    // Navbar
    tools: "Herramientas",
    installation: "Instalación",
    useCases: "Ejemplos",
    
    // Hero
    mcpServer: "MCP Server",
    heroTitle1: "FinSage",
    heroTitle2: "Chart Gallery",
    heroDescription: "Servidor MCP que conecta tu asistente de IA con datos financieros en tiempo real via Finnhub API.",
    getStarted: "Comenzar",
    viewOnGithub: "Ver en GitHub",
    
    // Use Cases
    useCasesTag: "Casos de Uso",
    useCasesTitle: "Ejemplos en Acción",
    useCasesDescription: "Mira cómo FinSage responde a preguntas financieras con visualizaciones interactivas",
    demo1Prompt: "¿Cómo se compara el market cap entre las seis grandes tecnológicas?",
    demo2Prompt: "¿Cómo le ha ido a TSLA en sus reportes de earnings recientes? ¿Superó o falló las expectativas?",
    demo3Prompt: "Muéstrame las métricas financieras clave de NVDA en un gráfico radar para evaluar su salud financiera",
    
    // Tools
    toolsTag: "7 Tools",
    toolsTitle: "Herramientas Poderosas",
    toolsDescription: "Todo lo que necesitas para obtener datos financieros en tiempo real",
    tool1Desc: "Noticias del mercado en tiempo real. Filtra por: general, forex, crypto, fusiones.",
    tool2Desc: "Noticias específicas de cualquier empresa de Norte América por símbolo.",
    tool3Desc: "Calendario de reportes de ganancias. Sabe cuándo reporta cada empresa.",
    tool4Desc: "Precio actual de cualquier acción: cambio del día, máximo, mínimo, apertura.",
    tool5Desc: "Métricas clave: P/E ratio, 52-week high/low, márgenes y más.",
    tool6Desc: "Historial de sorpresas en earnings: ¿superó o falló las expectativas?",
    tool7Desc: "Crea gráficos interactivos directamente en el chat. Líneas, barras, pie, dona, radar.",
    new: "Nuevo",
    
    // Installation
    quickStart: "Quick Start",
    installTitle: "Instalación en 4 Pasos",
    installDescription: "Configura FinSage en menos de 5 minutos",
    step1Title: "Obtén tu API Key (Gratis)",
    step1Desc: "Registra una cuenta gratuita en Finnhub.io y copia tu API Key. El plan gratuito es suficiente para uso personal.",
    step2Title: "Clona e Instala",
    step3Title: "Configura tu API Key",
    step4Title: "Conecta con tu Asistente",
    terminal: "Terminal",
    
    // Footer
    documentation: "Documentación",
    madeWith: "Hecho con 💚 para inversionistas y programadores",
    allRights: "Todos los derechos reservados.",
  },
  en: {
    // Navbar
    tools: "Tools",
    installation: "Installation",
    useCases: "Examples",
    
    // Hero
    mcpServer: "MCP Server",
    heroTitle1: "FinSage",
    heroTitle2: "Chart Gallery",
    heroDescription: "MCP server that connects your AI assistant with real-time financial data via Finnhub API.",
    getStarted: "Get Started",
    viewOnGithub: "View on GitHub",
    
    // Use Cases
    useCasesTag: "Use Cases",
    useCasesTitle: "Examples in Action",
    useCasesDescription: "See how FinSage responds to financial questions with interactive visualizations",
    demo1Prompt: "How does market cap compare across the Magnificent Six tech stocks?",
    demo2Prompt: "How has TSLA performed in its recent earnings reports? Did it beat or miss expectations?",
    demo3Prompt: "Show me NVDA's key financial metrics in a radar chart to evaluate its financial health",
    
    // Tools
    toolsTag: "7 Tools",
    toolsTitle: "Powerful Tools",
    toolsDescription: "Everything you need to get real-time financial data",
    tool1Desc: "Real-time market news. Filter by: general, forex, crypto, mergers.",
    tool2Desc: "Company-specific news for any North American company by symbol.",
    tool3Desc: "Earnings report calendar. Know when each company reports.",
    tool4Desc: "Current price of any stock: daily change, high, low, open.",
    tool5Desc: "Key metrics: P/E ratio, 52-week high/low, margins and more.",
    tool6Desc: "Earnings surprises history: beat or missed expectations?",
    tool7Desc: "Create interactive charts directly in chat. Lines, bars, pie, doughnut, radar.",
    new: "New",
    
    // Installation
    quickStart: "Quick Start",
    installTitle: "Installation in 4 Steps",
    installDescription: "Set up FinSage in less than 5 minutes",
    step1Title: "Get your API Key (Free)",
    step1Desc: "Register a free account at Finnhub.io and copy your API Key. The free plan is enough for personal use.",
    step2Title: "Clone & Install",
    step3Title: "Configure your API Key",
    step4Title: "Connect with your Assistant",
    terminal: "Terminal",
    
    // Footer
    documentation: "Documentation",
    madeWith: "Made with 💚 for investors and developers",
    allRights: "All rights reserved.",
  },
}

type TranslationKey = keyof typeof translations.es

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale
    if (saved && (saved === "es" || saved === "en")) {
      setLocale(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("locale", locale)
    }
  }, [locale, mounted])

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
