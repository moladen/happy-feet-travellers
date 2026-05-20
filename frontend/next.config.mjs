import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, '..');

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
let apiHostname = 'localhost';
try {
  apiHostname = new URL(apiUrl.replace(/\/api\/?$/, '/')).hostname;
} catch {
  /* keep default */
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep tracing and Turbopack rooted at the monorepo so hoisted deps resolve.
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'http', hostname: apiHostname, pathname: '/uploads/**' },
      { protocol: 'https', hostname: apiHostname, pathname: '/uploads/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/uploads/**' },
      { protocol: 'http', hostname: 'api', pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
