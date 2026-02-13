/**
 * Imágenes de Pixabay para FinSage MCP
 * Todas las URLs apuntan al CDN de Pixabay
 */

export const images = {
  hero: {
    ai: "https://cdn.pixabay.com/photo/2023/01/26/22/14/ai-generated-7747244_1280.jpg",
    robot: "https://cdn.pixabay.com/photo/2023/04/06/15/50/artificial-intelligence-7904296_1280.jpg",
    tech: "https://cdn.pixabay.com/photo/2023/05/04/14/03/artificial-intelligence-7970185_1280.jpg"
  },
  problem: {
    stress: "https://cdn.pixabay.com/photo/2022/12/15/21/16/stress-7657831_1280.jpg",
    confused: "https://cdn.pixabay.com/photo/2017/11/27/07/02/time-2980690_1280.jpg"
  },
  solution: {
    aiWork: "https://cdn.pixabay.com/photo/2023/12/21/01/29/ai-generated-8461130_1280.jpg",
    success: "https://cdn.pixabay.com/photo/2023/11/29/15/43/businessman-8420558_1280.jpg"
  },
  tools: {
    trading: "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    analytics: "https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_1280.jpg",
    chart: "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    finance: "https://cdn.pixabay.com/photo/2016/03/26/13/09/workspace-1280538_1280.jpg"
  },
  installation: {
    code: "https://cdn.pixabay.com/photo/2023/05/03/05/50/programming-7967471_1280.jpg",
    laptop: "https://cdn.pixabay.com/photo/2015/05/31/10/55/man-791049_1280.jpg"
  },
  examples: {
    dashboard: "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    chart: "https://cdn.pixabay.com/photo/2021/01/15/17/01/green-5919790_1280.jpg",
    data: "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg"
  },
  contribute: {
    github: "https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png",
    team: "https://cdn.pixabay.com/photo/2017/06/25/19/32/teamwork-2441359_1280.jpg"
  }
}

/**
 * Helper para agregar parámetros de optimización a URLs de Pixabay
 */
export function getOptimizedImage(url: string, width: number = 1280): string {
  return `${url}?w=${width}`
}
