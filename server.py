#!/usr/bin/env python3
"""
FinSage MCP Server - Servidor MCP para datos financieros via Finnhub API
"""
import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración Finnhub
FINNHUB_API_KEY = os.environ.get('FINNHUB_API_KEY')
if not FINNHUB_API_KEY:
    raise ValueError("FINNHUB_API_KEY no está configurada. Agrega tu API key al archivo .env")
FINNHUB_URL = 'https://finnhub.io/api/v1'

# Crear servidor MCP
mcp = FastMCP("finsage")

# URI del recurso UI para charts
CHART_VIEW_URI = "ui://finsage/chart-view.html"

# HTML embebido para el visor de charts
CHART_VIEW_HTML = """<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>FinSage Chart</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f1f5f9; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .loading { display: flex; align-items: center; justify-content: center; height: 100vh; color: #64748b; }
    h2 { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 16px; text-align: center; }
    .metrics { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center; }
    .metric-card { background: #f8fafc; border-radius: 8px; padding: 12px 16px; min-width: 120px; text-align: center; }
    .metric-label { font-size: 12px; color: #64748b; margin-bottom: 4px; }
    .metric-value { font-size: 20px; font-weight: bold; color: #1e293b; }
    .trend-up { color: #10b981; }
    .trend-down { color: #ef4444; }
    .trend-neutral { color: #6b7280; }
    .chart-container { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    canvas { max-height: 400px; }
    .insights { background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; padding: 16px; margin-top: 20px; }
    .insights-title { font-weight: bold; color: #1e40af; margin-bottom: 8px; font-size: 14px; }
    .insights ul { margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; }
    .insights li { margin-bottom: 4px; }
    @media (prefers-color-scheme: dark) {
      body { background: #1e293b; }
      h2 { color: #f1f5f9; }
      .metric-card { background: #334155; }
      .metric-label { color: #94a3b8; }
      .metric-value { color: #f1f5f9; }
      .chart-container { background: #334155; }
      .insights { background: #1e3a5f; border-color: #3b82f6; }
      .insights-title { color: #93c5fd; }
      .insights ul { color: #bfdbfe; }
    }
  </style>
</head>
<body>
  <div id="root" class="loading">Esperando datos...</div>
  <script type="module">
    import { App } from "https://unpkg.com/@modelcontextprotocol/ext-apps@0.4.0/app-with-deps";

    const app = new App({ name: "FinSage Chart", version: "1.0.0" });
    let chartInstance = null;

    const defaultColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(20, 184, 166, 0.8)',
      'rgba(249, 115, 22, 0.8)',
    ];

    function renderChart(data) {
      const root = document.getElementById('root');
      root.className = 'container';
      
      // Build metrics HTML
      let metricsHtml = '';
      if (data.metricas && data.metricas.length > 0) {
        const items = data.metricas.map(m => {
          const icon = m.tendencia === 'up' ? '↑' : m.tendencia === 'down' ? '↓' : '→';
          const trendClass = m.tendencia === 'up' ? 'trend-up' : m.tendencia === 'down' ? 'trend-down' : 'trend-neutral';
          return `<div class="metric-card">
            <div class="metric-label">${m.label}</div>
            <div class="metric-value">${m.valor} <span class="${trendClass}">${icon}</span></div>
          </div>`;
        }).join('');
        metricsHtml = `<div class="metrics">${items}</div>`;
      }

      // Build insights HTML
      let insightsHtml = '';
      if (data.insights && data.insights.length > 0) {
        const items = data.insights.map(i => `<li>${i}</li>`).join('');
        insightsHtml = `<div class="insights">
          <div class="insights-title">💡 Insights</div>
          <ul>${items}</ul>
        </div>`;
      }

      root.innerHTML = `
        <h2>${data.titulo}</h2>
        ${metricsHtml}
        <div class="chart-container">
          <canvas id="chart"></canvas>
        </div>
        ${insightsHtml}
      `;

      // Prepare datasets
      const datasets = data.series.map((serie, i) => ({
        label: serie.nombre || `Serie ${i+1}`,
        data: serie.valores || [],
        backgroundColor: serie.color || defaultColors[i % defaultColors.length],
        borderColor: serie.color || defaultColors[i % defaultColors.length],
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }));

      // Create chart
      const ctx = document.getElementById('chart').getContext('2d');
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type: data.tipo,
        data: { labels: data.labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false }
          }
        }
      });
    }

    app.ontoolresult = (result) => {
      const textContent = result.content?.find(c => c.type === 'text');
      if (textContent) {
        try {
          const data = JSON.parse(textContent.text);
          if (data.chart_data) {
            renderChart(data.chart_data);
          }
        } catch (e) {
          console.error('Error parsing chart data:', e);
        }
      }
    };

    await app.connect();
  </script>
</body>
</html>"""


# Resource que sirve el HTML del visor de charts
@mcp.resource(
    CHART_VIEW_URI,
    mime_type="text/html;profile=mcp-app",
    meta={"ui": {"csp": {"resourceDomains": ["https://cdn.jsdelivr.net", "https://unpkg.com"]}}},
)
def chart_view() -> str:
    """HTML resource for chart visualization."""
    return CHART_VIEW_HTML


def fetch_finnhub(endpoint: str, params: dict = None) -> dict | list:
    """Hace request a Finnhub API"""
    url = f"{FINNHUB_URL}/{endpoint}"
    if params is None:
        params = {}
    params['token'] = FINNHUB_API_KEY
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Finnhub Error {response.status_code}: {response.text}")


@mcp.tool()
def GET_MARKET_NEWS(category: str = "general", min_id: int = 0) -> dict:
    """
    Obtiene las últimas noticias del mercado.
    
    Args:
        category: Categoría de noticias. Valores válidos:
            - "general" (noticias generales del mercado)
            - "forex" (mercado de divisas)
            - "crypto" (criptomonedas)
            - "merger" (fusiones y adquisiciones)
        min_id: ID mínimo para obtener solo noticias después de este ID (default: 0)
    
    Returns:
        Lista de noticias con headline, summary, source, url, etc.
    """
    try:
        params = {'category': category}
        if min_id > 0:
            params['minId'] = min_id
        
        data = fetch_finnhub('news', params)
        
        news_list = []
        for article in data:
            news_list.append({
                "id": article.get('id'),
                "category": article.get('category'),
                "headline": article.get('headline'),
                "summary": article.get('summary'),
                "source": article.get('source'),
                "url": article.get('url'),
                "image": article.get('image'),
                "related": article.get('related'),
                "datetime": datetime.fromtimestamp(article.get('datetime', 0)).isoformat()
            })
        
        return {
            "category": category,
            "count": len(news_list),
            "news": news_list
        }
    except Exception as e:
        return {"error": str(e)}



@mcp.tool()
def GET_COMPANY_NEWS(symbol: str, from_date: str, to_date: str) -> dict:
    """
    Obtiene noticias de una compañía específica por símbolo.
    Solo disponible para compañías de Norte América.
    
    Args:
        symbol: Símbolo del ticker (ej: AAPL, MSFT, GOOGL)
        from_date: Fecha inicio en formato YYYY-MM-DD
        to_date: Fecha fin en formato YYYY-MM-DD
    
    Returns:
        Lista de noticias con headline, summary, source, url, etc.
    """
    try:
        params = {
            'symbol': symbol.upper(),
            'from': from_date,
            'to': to_date
        }
        
        data = fetch_finnhub('company-news', params)
        
        news_list = []
        for article in data:
            news_list.append({
                "id": article.get('id'),
                "category": article.get('category'),
                "headline": article.get('headline'),
                "summary": article.get('summary'),
                "source": article.get('source'),
                "url": article.get('url'),
                "image": article.get('image'),
                "related": article.get('related'),
                "datetime": datetime.fromtimestamp(article.get('datetime', 0)).isoformat()
            })
        
        return {
            "symbol": symbol.upper(),
            "from": from_date,
            "to": to_date,
            "count": len(news_list),
            "news": news_list
        }
    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def GET_EARNINGS_CALENDAR(
    from_date: str = None,
    to_date: str = None,
    symbol: str = None,
    international: bool = False
) -> dict:
    """
    Obtiene calendario de earnings históricos y próximos.
    EPS y Revenue son non-GAAP (ajustados para excluir items únicos).
    
    Args:
        from_date: Fecha inicio en formato YYYY-MM-DD (opcional)
        to_date: Fecha fin en formato YYYY-MM-DD (opcional)
        symbol: Filtrar por símbolo específico (ej: AAPL) (opcional)
        international: Incluir mercados internacionales (default: False)
    
    Returns:
        Lista de earnings con fecha, EPS actual/estimado, revenue actual/estimado, hora (bmo/amc/dmh)
    """
    try:
        params = {}
        if from_date:
            params['from'] = from_date
        if to_date:
            params['to'] = to_date
        if symbol:
            params['symbol'] = symbol.upper()
        if international:
            params['international'] = 'true'
        
        data = fetch_finnhub('calendar/earnings', params)
        
        earnings_list = []
        for earning in data.get('earningsCalendar', []):
            earnings_list.append({
                "date": earning.get('date'),
                "symbol": earning.get('symbol'),
                "hour": earning.get('hour'),
                "quarter": earning.get('quarter'),
                "year": earning.get('year'),
                "eps_actual": earning.get('epsActual'),
                "eps_estimate": earning.get('epsEstimate'),
                "revenue_actual": earning.get('revenueActual'),
                "revenue_estimate": earning.get('revenueEstimate')
            })
        
        return {
            "from": from_date,
            "to": to_date,
            "symbol": symbol.upper() if symbol else None,
            "count": len(earnings_list),
            "earnings": earnings_list
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def GET_QUOTE(symbol: str) -> dict:
    """
    Obtiene cotización en tiempo real para acciones de EE.UU.
    No se recomienda polling constante. Usa websocket para actualizaciones en tiempo real.

    Args:
        symbol: Símbolo del ticker (ej: AAPL, MSFT, GOOGL)

    Returns:
        Datos de cotización con precio actual, cambio, máximo/mínimo del día, apertura y cierre anterior.
    """
    try:
        params = {'symbol': symbol.upper()}
        data = fetch_finnhub('quote', params)

        return {
            "symbol": symbol.upper(),
            "current_price": data.get('c'),
            "change": data.get('d'),
            "percent_change": data.get('dp'),
            "high": data.get('h'),
            "low": data.get('l'),
            "open": data.get('o'),
            "previous_close": data.get('pc'),
            "timestamp": datetime.fromtimestamp(data.get('t', 0)).isoformat() if data.get('t') else None
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def GET_BASIC_FINANCIALS(symbol: str, metric: str = "all") -> dict:
    """
    Obtiene métricas financieras básicas de una compañía como margen, P/E ratio, 52-week high/low, etc.

    Args:
        symbol: Símbolo del ticker (ej: AAPL, MSFT, GOOGL)
        metric: Tipo de métrica. Valor válido: "all"

    Returns:
        Métricas financieras incluyendo ratios clave, series temporales y datos de valoración.
    """
    try:
        params = {
            'symbol': symbol.upper(),
            'metric': metric
        }
        data = fetch_finnhub('stock/metric', params)

        return {
            "symbol": data.get('symbol'),
            "metric_type": data.get('metricType'),
            "metric": data.get('metric', {}),
            "series": data.get('series', {})
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def GET_EARNING_SURPRISES(symbol: str, limit: int = None) -> dict:
    """
    Obtiene el historial de sorpresas de earnings trimestrales de una compañía.
    Datos disponibles desde el año 2000. Free tier: últimos 4 trimestres.

    Args:
        symbol: Símbolo del ticker (ej: AAPL, MSFT, TSLA)
        limit: Límite de períodos a retornar (opcional). Dejar en blanco para historial completo.

    Returns:
        Lista de earnings con actual, estimado, sorpresa y porcentaje de sorpresa por trimestre.
    """
    try:
        params = {'symbol': symbol.upper()}
        if limit is not None:
            params['limit'] = limit

        data = fetch_finnhub('stock/earnings', params)

        earnings_list = []
        for earning in data:
            earnings_list.append({
                "symbol": earning.get('symbol'),
                "period": earning.get('period'),
                "year": earning.get('year'),
                "quarter": earning.get('quarter'),
                "actual": earning.get('actual'),
                "estimate": earning.get('estimate'),
                "surprise": earning.get('surprise'),
                "surprise_percent": earning.get('surprisePercent')
            })

        return {
            "symbol": symbol.upper(),
            "count": len(earnings_list),
            "earnings": earnings_list
        }
    except Exception as e:
        return {"error": str(e)}


@mcp.tool(meta={
    "ui": {"resourceUri": CHART_VIEW_URI},
})
def SET_CHART(
    titulo: str,
    tipo: str,
    labels: list,
    series: list,
    metricas: list = None,
    insights: list = None
) -> str:
    """
    Crea una visualización interactiva con Chart.js.
    Soporta gráficos de línea, barras, dona, pie, radar y área polar.
    Ideal para visualizar datos financieros.

    Args:
        titulo: Título del gráfico
        tipo: Tipo de gráfico. Valores válidos: "line", "bar", "doughnut", "pie", "radar", "polarArea"
        labels: Lista de etiquetas para el eje X o categorías (ej: ["Q1", "Q2", "Q3", "Q4"])
        series: Lista de series de datos. Cada serie es un dict con:
            - nombre: Nombre de la serie (aparece en leyenda)
            - valores: Lista de valores numéricos
            - color: (opcional) Color CSS (ej: "rgba(59, 130, 246, 0.8)" o "#3b82f6")
        metricas: (opcional) Lista de KPIs a mostrar. Cada métrica es un dict con:
            - label: Etiqueta de la métrica
            - valor: Valor a mostrar (string o número)
            - tendencia: "up", "down" o "neutral" (muestra ↑↓→)
        insights: (opcional) Lista de strings con observaciones o insights del análisis

    Returns:
        HTML con el gráfico interactivo renderizado con Chart.js
    """
    try:
        chart_data = {
            "titulo": titulo,
            "tipo": tipo,
            "labels": labels,
            "series": series,
            "metricas": metricas or [],
            "insights": insights or []
        }
        
        return json.dumps({
            "success": True,
            "message": f"Gráfico '{titulo}' generado exitosamente",
            "chart_data": chart_data
        })
    except Exception as e:
        return json.dumps({"error": str(e)})







if __name__ == "__main__":
    mcp.run()
