import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@ajoseph/app-launcher'],
  async headers() { return [{ source: '/apps.json', headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
    { key: 'Cache-Control', value: 'no-store' },
    { key: 'X-Content-Type-Options', value: 'nosniff' }
  ] }, { source: '/sw.js', headers: [
    { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
    { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
    { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" }
  ] }]; }
};
export default config;
