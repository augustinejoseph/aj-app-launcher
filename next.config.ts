import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@ajoseph/app-launcher'],
  async headers() { return [{ source: '/apps.json', headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
    { key: 'Cache-Control', value: 'no-store' },
    { key: 'X-Content-Type-Options', value: 'nosniff' }
  ] }]; }
};
export default config;
