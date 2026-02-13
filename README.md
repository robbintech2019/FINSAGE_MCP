# 🧠 FinSage MCP

🌐 **[Website](https://robbintech2019.github.io/FINSAGE_MCP/)**

FinSage es un servidor MCP (Model Context Protocol) que conecta agentes de IA como Claude con el API de Finnhub.io(se agregaran otras en el futuro) para obtener datos del mercado en tiempo real. Pregunta sobre cualquier acción, analiza tendencias, y toma decisiones financieras informadas — todo desde tu chat.

Y esto es solo el comienzo, seguimos agregando más herramientas.

---

## 🎯 ¿Qué puedes hacer con FinSage?

- **Cotizaciones en Tiempo Real** - Obtén el precio actual de cualquier acción de EE.UU. con cambio porcentual, máximos y mínimos del día.
- **Noticias del Mercado** - Accede a las últimas noticias financieras filtradas por categoría: general, forex, crypto o fusiones.
- **Análisis de Earnings** - Revisa el historial de reportes de ganancias y descubre si una empresa superó o falló las expectativas.
- **Métricas Financieras** - Consulta ratios clave como P/E, márgenes de ganancia, 52-week high/low y más indicadores.
- **Calendario de Reportes** - Sabe exactamente cuándo cada empresa publicará sus resultados trimestrales.
- **Visualizaciones Interactivas** - Genera gráficos dinámicos directamente en el chat para visualizar datos y comparar métricas.

---

## 🛠️ Herramientas Disponibles

FinSage actualmente cuenta con **7 herramientas**:

| Herramienta | ¿Qué hace? | Ejemplo de uso |
|-------------|------------|----------------|
| 📰 **GET_MARKET_NEWS** | Obtiene las últimas noticias del mercado financiero. Puedes filtrar por categoría: general, forex, crypto o fusiones. | *"Dame las noticias de crypto"* |
| 🏢 **GET_COMPANY_NEWS** | Busca noticias específicas de una empresa por su símbolo (ticker). Solo empresas de Norte América. | *"Noticias de AAPL del último mes"* |
| 📅 **GET_EARNINGS_CALENDAR** | Muestra cuándo las empresas reportan sus ganancias trimestrales. Incluye estimados vs resultados reales. | *"¿Cuándo reporta earnings NVDA?"* |
| 💵 **GET_QUOTE** | Obtiene el precio actual de una acción en tiempo real, incluyendo cambio del día, máximo, mínimo y apertura. | *"¿Cuánto vale TSLA ahora?"* |
| 📊 **GET_BASIC_FINANCIALS** | Métricas financieras clave: P/E ratio, máximo/mínimo de 52 semanas, márgenes, y más. | *"Dame los financials de MSFT"* |
| 📈 **GET_EARNING_SURPRISES** | Historial de sorpresas en earnings: cuánto superó o falló una empresa vs las expectativas. | *"¿Cómo le fue a GOOGL en earnings?"* |
| 📉 **SET_CHART** | Crea gráficos interactivos con Chart.js. Soporta líneas, barras, pie, dona, radar y más. Incluye toggle de tema dark/light. | *"Muéstrame un gráfico de earnings de AAPL"* |

---

## 🚀 Instalación

### 1. Obtén tu API Key (Gratis)

1. Ve a [Finnhub.io](https://finnhub.io/)
2. Crea una cuenta gratuita
3. Copia tu API Key desde el dashboard

> 💡 El plan gratuito es suficiente para uso personal.

### 2. Configura el proyecto

```bash
git clone https://github.com/robbintech2019/FINSAGE_MCP.git
cd FINSAGE_MCP
pip install -r requirements.txt
```

### 3. Configura tu API Key

Renombra `.env.example` a `.env` y agrega tu API Key:

```
FINNHUB_API_KEY=tu_api_key_aqui
```

### 4. Conecta con tu asistente de IA

Agrega esta configuración en tu archivo MCP:

```json
{
  "mcpServers": {
    "finsage": {
      "command": "python",
      "args": ["/ruta/a/server.py"]
    }
  }
}
```

---

## 📁 Estructura del Proyecto

```
finsage-mcp/
├── server.py          # Servidor MCP con todas las herramientas
├── templates/         # Templates HTML para visualizaciones
├── requirements.txt   # Dependencias
├── .env               # Tu API Key (no se sube a git)
└── website/           # Landing page del proyecto
```

---

## 📋 Próximas Funcionalidades

- [ ] Búsqueda en bulk - Consultar múltiples símbolos a la vez
- [ ] Análisis de sentimiento de noticias financieras
- [ ] Top Movers - Acciones con mayor movimiento del día

---

## 🤝 Contribuciones

¿Tienes ideas para nuevas herramientas? ¡Las contribuciones son bienvenidas!

---

## 📄 Licencia

MIT License

---

**Hecho con 💚 para inversionistas y programadores**
