#!/usr/bin/env python3
"""
FinSage MCP Server - Servidor MCP para datos financieros via Finnhub API
"""
import os
import json
import requests
from datetime import datetime
from pathlib import Path
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

# Cargar HTML desde archivo externo
TEMPLATES_DIR = Path(__file__).parent / "templates"

def load_template(name: str) -> str:
    """Carga un template HTML desde la carpeta templates."""
    template_path = TEMPLATES_DIR / name
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()


# Resource que sirve el HTML del visor de charts
@mcp.resource(
    CHART_VIEW_URI,
    mime_type="text/html;profile=mcp-app",
    meta={"ui": {"csp": {"resourceDomains": ["https://cdn.jsdelivr.net", "https://unpkg.com"]}}},
)
def chart_view() -> str:
    """HTML resource for chart visualization."""
    return load_template("chart-view.html")


def decode_unicode(text: str) -> str:
    """Decodifica caracteres Unicode escapados en un string."""
    if text is None:
        return None
    if isinstance(text, str):
        # Decodifica secuencias unicode_escape y luego a UTF-8
        try:
            return text.encode('utf-8').decode('unicode_escape').encode('latin-1').decode('utf-8')
        except (UnicodeDecodeError, UnicodeEncodeError):
            # Si falla, intenta solo decode unicode_escape
            try:
                return text.encode('utf-8').decode('unicode_escape')
            except (UnicodeDecodeError, UnicodeEncodeError):
                return text
    return text


def decode_dict_values(data: dict, keys: list) -> dict:
    """Decodifica valores Unicode en las claves especificadas de un diccionario."""
    for key in keys:
        if key in data and isinstance(data[key], str):
            data[key] = decode_unicode(data[key])
    return data


def fetch_finnhub(endpoint: str, params: dict = None) -> dict | list:
    """Hace request a Finnhub API"""
    url = f"{FINNHUB_URL}/{endpoint}"
    if params is None:
        params = {}
    params['token'] = FINNHUB_API_KEY
    
    response = requests.get(url, params=params)
    response.encoding = 'utf-8'  # Asegurar encoding UTF-8
    
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
                "headline": decode_unicode(article.get('headline')),
                "summary": decode_unicode(article.get('summary')),
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
                "headline": decode_unicode(article.get('headline')),
                "summary": decode_unicode(article.get('summary')),
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
def GET_BULK_QUOTES(symbols: list[str]) -> dict:
    """
    Obtiene cotizaciones en tiempo real para múltiples acciones de EE.UU. en una sola llamada.
    Internamente consulta cada símbolo y consolida los resultados.

    Args:
        symbols: Lista de símbolos de ticker (ej: ["AAPL", "MSFT", "GOOGL", "TSLA"])

    Returns:
        Objeto con cotizaciones de todos los símbolos solicitados, incluyendo precio actual,
        cambio, porcentaje de cambio, máximo/mínimo del día, apertura y cierre anterior.
        También incluye conteo de éxitos y errores.
    """
    results = []
    errors = []

    for symbol in symbols:
        try:
            params = {'symbol': symbol.upper()}
            data = fetch_finnhub('quote', params)

            results.append({
                "symbol": symbol.upper(),
                "current_price": data.get('c'),
                "change": data.get('d'),
                "percent_change": data.get('dp'),
                "high": data.get('h'),
                "low": data.get('l'),
                "open": data.get('o'),
                "previous_close": data.get('pc'),
                "timestamp": datetime.fromtimestamp(data.get('t', 0)).isoformat() if data.get('t') else None
            })
        except Exception as e:
            errors.append({
                "symbol": symbol.upper(),
                "error": str(e)
            })

    return {
        "total_requested": len(symbols),
        "successful": len(results),
        "failed": len(errors),
        "quotes": results,
        "errors": errors if errors else None
    }


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
        }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": str(e)}, ensure_ascii=False)







if __name__ == "__main__":
    mcp.run()
