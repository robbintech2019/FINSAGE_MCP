"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

const COLORS = {
  primary: "#00E5A0",
  secondary: "#7B61FF", 
  accent: "#FF6B6B",
  warning: "#FFB800",
  primaryBg: "rgba(0,229,160,0.15)",
  secondaryBg: "rgba(123,97,255,0.15)",
  accentBg: "rgba(255,107,107,0.15)",
}

// Sample TSLA earnings data
const earningsData = {
  labels: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
  actual: [0.27, 0.40, 0.50, 0.50],
  estimated: [0.40, 0.44, 0.56, 0.46],
}

interface HeroChartProps {
  locale: "es" | "en"
}

export function HeroChart({ locale }: HeroChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const t = {
    es: {
      question: "¿Cómo le ha ido a TSLA en sus reportes de earnings recientes? ¿Superó o falló las expectativas?",
      title: "TSLA — EPS Real vs Estimado (2025)",
      lineChart: "Line Chart",
      actualEps: "EPS Real",
      estimatedEps: "EPS Estimado",
      latestEps: "ÚLTIMO EPS",
      lastSurprise: "ÚLTIMA SORPRESA",
      beatRate: "TASA DE ACIERTO",
      insights: "INSIGHTS",
      insight1: "TSLA falló expectativas 3 trimestres consecutivos (Q1-Q3 2025)",
      insight2: "Q4 2025 fue el único trimestre con sorpresa positiva: +9.67%",
      insight3: "Q1 2025 fue el peor trimestre con -32.33% bajo estimados",
      insight4: "Tendencia de recuperación: EPS subió de $0.27 en Q1 a $0.50 en Q4",
    },
    en: {
      question: "How has TSLA performed in its recent earnings reports? Did it beat or miss expectations?",
      title: "TSLA — Actual vs Estimated EPS (2025)",
      lineChart: "Line Chart",
      actualEps: "Actual EPS",
      estimatedEps: "Estimated EPS",
      latestEps: "LATEST EPS",
      lastSurprise: "LAST SURPRISE",
      beatRate: "BEAT RATE",
      insights: "INSIGHTS",
      insight1: "TSLA missed expectations 3 consecutive quarters (Q1-Q3 2025)",
      insight2: "Q4 2025 was the only quarter with a positive surprise: +9.67%",
      insight3: "Q1 2025 was the worst quarter at -32.33% below estimates",
      insight4: "Recovery trend: EPS rose from $0.27 in Q1 to $0.50 in Q4",
    },
  }

  const text = t[locale]

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: earningsData.labels,
        datasets: [
          {
            label: text.actualEps,
            data: earningsData.actual,
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primaryBg,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: COLORS.primary,
            pointBorderColor: COLORS.primary,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: true,
          },
          {
            label: text.estimatedEps,
            data: earningsData.estimated,
            borderColor: COLORS.accent,
            backgroundColor: COLORS.accentBg,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: COLORS.accent,
            pointBorderColor: COLORS.accent,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            position: "top",
            align: "center",
            labels: {
              color: "#CBD5E1",
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: "rgba(15,23,42,0.95)",
            titleColor: COLORS.primary,
            bodyColor: "#E2E8F0",
            borderColor: COLORS.primary,
            borderWidth: 1,
            padding: 12,
            titleFont: { family: "'JetBrains Mono', monospace", weight: "bold" },
            bodyFont: { family: "'JetBrains Mono', monospace" },
            callbacks: {
              label: (context) => `${context.dataset.label}: $${(context.parsed.y ?? 0).toFixed(2)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(100,116,139,0.15)" },
            ticks: { 
              color: "#64748B",
              font: { family: "'JetBrains Mono', monospace", size: 11 },
            },
          },
          y: {
            grid: { color: "rgba(100,116,139,0.15)" },
            ticks: {
              color: "#64748B",
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              callback: (value) => `$${Number(value).toFixed(2)}`,
            },
            min: 0.25,
            max: 0.60,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [locale, text.actualEps, text.estimatedEps])

  return (
    <div className="glass-card rounded-2xl overflow-hidden glow-primary">
      {/* Window header */}
      <div className="bg-muted/50 px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-accent"></div>
          <div className="h-3 w-3 rounded-full bg-warning"></div>
          <div className="h-3 w-3 rounded-full bg-primary"></div>
        </div>
        <span className="text-xs font-medium text-muted-foreground ml-auto">AI Assistant</span>
      </div>

      <div className="p-4 space-y-4">
        {/* User question */}
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-secondary/20 border border-secondary/30 px-4 py-2.5 max-w-[90%]">
            <p className="text-sm">{text.question}</p>
          </div>
        </div>

        {/* AI Response with Chart */}
        <div className="flex justify-start">
          <div className="w-full space-y-3">
            {/* Chart header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground">{text.title}</h3>
                  <p className="text-xs text-muted-foreground">{text.lineChart}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/30 rounded px-2 py-1">
                  LINE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/30 rounded px-2 py-1">
                  ⚡ LIVE
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{text.latestEps}</p>
                <p className="text-lg font-display font-bold text-foreground">$0.50 <span className="text-primary text-sm">↑</span></p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{text.lastSurprise}</p>
                <p className="text-lg font-display font-bold text-primary">+9.67% <span className="text-sm">↑</span></p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{text.beatRate}</p>
                <p className="text-lg font-display font-bold text-foreground">1 of 4 <span className="text-accent text-sm">↓</span></p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
              <div className="h-[200px]">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-muted/20 rounded-xl p-4 border-l-3 border-l-primary border border-border/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">💡 {text.insights}</p>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>{text.insight1}</li>
                <li>{text.insight2}</li>
                <li>{text.insight3}</li>
                <li>{text.insight4}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
