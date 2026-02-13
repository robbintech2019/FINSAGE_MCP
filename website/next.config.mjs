/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export para GitHub Pages
  basePath: '/FINSAGE_MCP',  // Nombre del repositorio
  images: {
    unoptimized: true,  // Necesario para static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      }
    ]
  }
}

export default nextConfig
