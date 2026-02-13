"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Github, Rocket, TrendingUp, Zap, Terminal, BarChart3, Newspaper, Calendar, DollarSign, LineChart, Globe, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { HeroChart } from "@/components/HeroChart"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-display font-bold">FinSage MCP</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <a href="#use-cases" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              {t("useCases")}
            </a>
            <a href="#tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              {t("tools")}
            </a>
            <a href="#installation" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              {t("installation")}
            </a>
            <a
              href="https://github.com/robbintech2019/FINSAGE_MCP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            {mounted && (
              <>
                <button
                  onClick={toggleLocale}
                  className="rounded-lg px-2.5 py-2 hover:bg-muted transition-colors border border-border/50 inline-flex items-center gap-1.5 text-xs font-semibold"
                  aria-label="Toggle language"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {locale.toUpperCase()}
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-lg p-2 hover:bg-muted transition-colors border border-border/50"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container relative py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary">
                <Zap className="h-3 w-3" />
                {t("mcpServer")}
              </div>
              <h1 className="text-4xl font-display font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="gradient-text">{t("heroTitle1")}</span>
                <br />
                <span className="text-foreground">{t("heroTitle2")}</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-xl leading-relaxed">
                {t("heroDescription")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#installation"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  <Rocket className="h-4 w-4" />
                  {t("getStarted")}
                </a>
                <a
                  href="https://github.com/robbintech2019/FINSAGE_MCP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-8 py-3.5 text-sm font-semibold hover:bg-muted hover:border-primary/30 transition-all"
                >
                  <Github className="h-4 w-4" />
                  {t("viewOnGithub")}
                </a>
              </div>
            </div>
            <div className="relative">
              <HeroChart locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary mb-4">
              <Sparkles className="h-3 w-3" />
              {t("useCasesTag")}
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              <span className="gradient-text">{t("useCasesTitle")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("useCasesDescription")}
            </p>
          </div>
          
          <div className="space-y-16">
            {[
              { promptKey: "demo1Prompt" as const, image: "/FINSAGE_MCP/images/demo1.png" },
              { promptKey: "demo2Prompt" as const, image: "/FINSAGE_MCP/images/demo2.png" },
              { promptKey: "demo3Prompt" as const, image: "/FINSAGE_MCP/images/demo3.png" },
            ].map((demo, i) => (
              <div key={i} className="space-y-6">
                <div className="glass-card rounded-xl p-4 max-w-3xl mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-secondary">?</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pt-1">
                      "{t(demo.promptKey)}"
                    </p>
                  </div>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="glass-card rounded-2xl overflow-hidden p-2">
                    <img
                      src={demo.image}
                      alt={`Demo ${i + 1}`}
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-secondary mb-4">
              <Terminal className="h-3 w-3" />
              {t("toolsTag")}
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              <span className="gradient-text">{t("toolsTitle")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("toolsDescription")}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Newspaper, name: "GET_MARKET_NEWS", descKey: "tool1Desc" as const, color: "primary" },
              { icon: TrendingUp, name: "GET_COMPANY_NEWS", descKey: "tool2Desc" as const, color: "secondary" },
              { icon: Calendar, name: "GET_EARNINGS_CALENDAR", descKey: "tool3Desc" as const, color: "accent" },
              { icon: DollarSign, name: "GET_QUOTE", descKey: "tool4Desc" as const, color: "warning" },
              { icon: BarChart3, name: "GET_BASIC_FINANCIALS", descKey: "tool5Desc" as const, color: "info" },
              { icon: LineChart, name: "GET_EARNING_SURPRISES", descKey: "tool6Desc" as const, color: "primary" },
              { icon: BarChart3, name: "SET_CHART", descKey: "tool7Desc" as const, badge: true, color: "secondary" },
            ].map((tool, i) => {
              const Icon = tool.icon
              const colorClasses = {
                primary: "text-primary bg-primary/10 border-primary/20",
                secondary: "text-secondary bg-secondary/10 border-secondary/20",
                accent: "text-accent bg-accent/10 border-accent/20",
                warning: "text-warning bg-warning/10 border-warning/20",
                info: "text-info bg-info/10 border-info/20",
              }
              return (
                <div key={i} className="group relative glass-card rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1 hover:glow-primary">
                  {tool.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {t("new")}
                    </span>
                  )}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${colorClasses[tool.color as keyof typeof colorClasses]} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono text-sm font-semibold mb-2 text-foreground">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(tool.descKey)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="container py-24 md:py-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary mb-4">
            <Rocket className="h-3 w-3" />
            {t("quickStart")}
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            <span className="gradient-text">{t("installTitle")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("installDescription")}
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              num: 1,
              titleKey: "step1Title" as const,
              descKey: "step1Desc" as const
            },
            {
              num: 2,
              titleKey: "step2Title" as const,
              code: "git clone https://github.com/robbintech2019/FINSAGE_MCP.git\ncd FINSAGE_MCP\npip install -r requirements.txt"
            },
            {
              num: 3,
              titleKey: "step3Title" as const,
              code: "FINNHUB_API_KEY=tu_api_key_aqui"
            },
            {
              num: 4,
              titleKey: "step4Title" as const,
              code: '{\n  "mcpServers": {\n    "finsage": {\n      "command": "python",\n      "args": ["/ruta/a/server.py"]\n    }\n  }\n}'
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/30 text-primary font-display font-bold text-lg">
                  {step.num}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-display font-semibold">{t(step.titleKey)}</h3>
                {step.descKey && <p className="text-muted-foreground text-sm leading-relaxed">{t(step.descKey)}</p>}
                {step.code && (
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="bg-muted/30 px-4 py-2 border-b border-border/50 flex items-center gap-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("terminal")}</div>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm text-muted-foreground">{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display font-semibold">FinSage MCP</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="https://github.com/robbintech2019/FINSAGE_MCP" className="text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </a>
              <a href="https://github.com/robbintech2019/FINSAGE_MCP#readme" className="text-muted-foreground hover:text-primary transition-colors">
                {t("documentation")}
              </a>
              <a href="https://github.com/robbintech2019/FINSAGE_MCP/blob/main/LICENSE" className="text-muted-foreground hover:text-primary transition-colors">
                MIT License
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t("madeWith")}
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FinSage MCP. {t("allRights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
