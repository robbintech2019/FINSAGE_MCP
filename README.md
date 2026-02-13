# 🧠 FinSage MCP

**Dale superpoderes financieros a tu asistente de IA 🚀**

FinSage es un servidor MCP (Model Context Protocol) que te permite obtener información financiera en tiempo real directamente desde tu asistente de IA favorito. Perfecto para inversionistas que quieren tomar decisiones informadas.

---

## 🎯 ¿Qué es esto?

Imagina poder preguntarle a tu asistente de IA:
- *"¿Cuál es el precio actual de Apple?"*
- *"¿Qué noticias hay sobre Tesla?"*
- *"¿Cuándo reporta earnings Microsoft?"*

FinSage hace exactamente eso. Conecta tu asistente de IA con datos financieros reales.

---

## 🛠️ Herramientas Disponibles

FinSage actualmente cuenta con **7 herramientas** (y seguimos agregando más):

| Herramienta | ¿Qué hace? | Ejemplo de uso |
|-------------|------------|----------------|
| 📰 **GET_MARKET_NEWS** | Obtiene las últimas noticias del mercado financiero. Puedes filtrar por categoría: general, forex, crypto o fusiones. | *"Dame las noticias de crypto"* |
| 🏢 **GET_COMPANY_NEWS** | Busca noticias específicas de una empresa por su símbolo (ticker). Solo empresas de Norte América. | *"Noticias de AAPL del último mes"* |
| 📅 **GET_EARNINGS_CALENDAR** | Muestra cuándo las empresas reportan sus ganancias trimestrales. Incluye estimados vs resultados reales. | *"¿Cuándo reporta earnings NVDA?"* |
| 💵 **GET_QUOTE** | Obtiene el precio actual de una acción en tiempo real, incluyendo cambio del día, máximo, mínimo y apertura. | *"¿Cuánto vale TSLA ahora?"* |
| 📊 **GET_BASIC_FINANCIALS** | Métricas financieras clave: P/E ratio, máximo/mínimo de 52 semanas, márgenes, y más. | *"Dame los financials de MSFT"* |
| 📈 **GET_EARNING_SURPRISES** | Historial de sorpresas en earnings: cuánto superó o falló una empresa vs las expectativas. | *"¿Cómo le fue a GOOGL en earnings?"* |
| 📉 **SET_CHART** | Crea gráficos interactivos con Chart.js. Soporta líneas, barras, pie, dona, radar y más. Usa MCP Apps para renderizar UI en el chat. | *"Muéstrame un gráfico de earnings de AAPL"* |

---

## 🚀 Instalación Paso a Paso

### Paso 1: Obtén tu API Key (Gratis)

1. Ve a [Finnhub.io](https://finnhub.io/)
2. Crea una cuenta gratuita
3. Copia tu API Key desde el dashboard

> 💡 **Nota:** Finnhub ofrece un plan gratuito que es suficiente para uso personal. No necesitas pagar nada.

### Paso 2: Configura el proyecto

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/finsage-mcp.git
cd finsage-mcp

# Instala las dependencias
pip install -r requirements.txt
```

> ⚠️ **Requisitos de versión:** Este proyecto requiere `mcp>=1.26.0` y `fastmcp>=2.14.5` para soportar MCP Apps (visualizaciones interactivas). Si tienes versiones anteriores, actualiza con:
> ```bash
> pip install --upgrade "mcp>=1.26.0" "fastmcp>=2.14.5"
> ```

### Paso 3: Configura tu API Key

1. Busca el archivo `.env.example` en la carpeta del proyecto
2. Renómbralo a `.env` (solo quita ".example" del nombre)
3. Abre el archivo y reemplaza `tu_api_key_aqui` con tu API Key de Finnhub

```
FINNHUB_API_KEY=tu_api_key_real_aqui
```

### Paso 4: Conecta con tu asistente de IA

Agrega esta configuración en tu archivo de configuración MCP:

```json
{
  "mcpServers": {
    "finsage": {
      "command": "python",
      "args": ["/ruta/completa/a/tu/carpeta/server.py"]
    }
  }
}
```

> ⚠️ **Importante:** Reemplaza `/ruta/completa/a/tu/carpeta/server.py` con la ubicación real donde guardaste el proyecto.
>
> **Ejemplo en Mac:** `/Users/tunombre/Documents/finsage-mcp/server.py`
>
> **Ejemplo en Windows:** `C:\\Users\\tunombre\\Documents\\finsage-mcp\\server.py`

---

## 📁 Estructura del Proyecto

```
finsage-mcp/
├── server.py          # El servidor principal (aquí está toda la magia)
├── requirements.txt   # Dependencias del proyecto
├── .env.example       # Plantilla para tu API Key
├── .env               # Tu API Key (no se sube a git)
├── .gitignore         # Archivos ignorados por git
└── README.md          # Este archivo
```

---

## 📋 TODO - Próximas Funcionalidades

- [ ] **Búsqueda en bulk** - Consultar múltiples símbolos a la vez en lugar de uno por uno
- [ ] **Análisis de sentimiento** - Herramienta para analizar el sentimiento de noticias financieras
- [ ] **Top Movers** - Ver las acciones con mayor movimiento del día (ganadores y perdedores)

---

## 🤝 Contribuciones

¿Tienes ideas para nuevas herramientas? ¡Las contribuciones son bienvenidas!

---

## 📄 Licencia

MIT License - Usa este proyecto como quieras.

---

**Hecho con ❤️ para inversionistas y programadores**
