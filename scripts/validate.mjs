import { loadEnvFile } from 'node:process';
import { validateRegistry } from '../packages/app-launcher/registry.js';
try { loadEnvFile(new URL('../.env', import.meta.url)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (!process.env.AJ_APPS_CONFIG) throw new Error('Set AJ_APPS_CONFIG to the registry JSON in .env (see .env.example).');
validateRegistry(JSON.parse(process.env.AJ_APPS_CONFIG), {
  allowLocalhost: process.env.NODE_ENV !== 'production' && process.env.AJ_LOCAL_DEVELOPMENT === 'true',
});
console.log('AJ_APPS_CONFIG registry validated.');
