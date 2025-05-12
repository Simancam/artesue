import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',   // cualquier dominio HTTPS
        port: '',         
        pathname: '/**',  // cualquier ruta
      },
      {
        protocol: 'http',
        hostname: '**',   // cualquier dominio HTTP
        port: '',
        pathname: '/**',
      }
    ],
    // O, si quieres desactivar totalmente la validación:
    // loader: 'custom',
    // loaderFile: './image-loader.js',
  }
};

export default nextConfig;