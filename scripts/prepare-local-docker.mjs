// Generates ignored local-only configuration. Never prints credentials.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const owner = process.argv[2];
if (!owner || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(owner)) throw new Error('Supply the verified local Health owner email');
const healthEnv = parseEnv(readFileSync(resolve(root, '../aj-health/aj-health-app/.env.local'), 'utf8'));
let healthConfig = {};
if (healthEnv.APP_CONFIG !== undefined) {
  try { healthConfig = JSON.parse(healthEnv.APP_CONFIG); }
  catch { throw new Error('Health APP_CONFIG must contain a valid JSON object'); }
  if (!healthConfig || Array.isArray(healthConfig) || typeof healthConfig !== 'object' ||
      Object.values(healthConfig).some(value => typeof value !== 'string')) {
    throw new Error('Health APP_CONFIG must contain an object of string values');
  }
}
const health = { ...healthConfig, ...healthEnv };
delete health.APP_CONFIG;
// Discard legacy input too, so an older env file cannot reintroduce the flag.
delete health.AUTH_PASSWORD_LOGIN_DISABLED;
for (const key of ['AUTH_GOOGLE_ID', 'AUTH_GOOGLE_SECRET']) {
  if (!health[key]?.trim()) throw new Error(`Configure ${key} in Health .env.local for Google-only authentication`);
}
const journal = JSON.parse(parseEnv(readFileSync(resolve(root, '../aj-journal/.env'), 'utf8')).APP_CONFIG);
const db = new URL(health.DATABASE_URL);
if (!['localhost', '127.0.0.1'].includes(db.hostname) || db.port !== '5433' || db.pathname !== '/bulkhead') throw new Error('Expected existing local Docker Health database; refusing nonlocal database');
db.hostname = 'postgres'; db.port = '5432'; db.search = '';
health.DATABASE_URL = db.toString(); health.AUTH_URL = 'http://localhost:3000';
health.AUTH_OWNER_EMAIL = owner; health.AUTH_TRUST_HOST = 'true';
const journalDb = new URL(db); journalDb.pathname = '/aj_journal_local';
journal.DATABASE_URL = journalDb.toString(); journal.AUTH_URL = 'http://localhost:3001'; journal.PRODUCTION_URL = 'http://localhost:3001'; journal.AUTH_TRUST_HOST = 'true';
mkdirSync(resolve(root, '.local'), { recursive: true, mode: 0o700 });
const serialize = entries => Object.entries(entries).map(([key,value]) => {
  if (/[\r\n]/.test(value)) throw new Error(`Multiline configuration is not supported: ${key}`);
  return `${key}=${value}`;
}).join('\n') + '\n';
writeFileSync(resolve(root, '.local/health.env'), serialize(health), { mode: 0o600 });
writeFileSync(resolve(root, '.local/journal.env'), `APP_CONFIG=${JSON.stringify(journal)}\n`, { mode: 0o600 });
const registry = JSON.parse(parseEnv(readFileSync(resolve(root, '.env'), 'utf8')).AJ_APPS_CONFIG);
const notesPath = resolve(root, '../aj-notes/.env');
let notesConfigured = false;
if (existsSync(notesPath)) {
  const notes = JSON.parse(parseEnv(readFileSync(notesPath, 'utf8')).APP_CONFIG);
  const notesDb = new URL(db); notesDb.pathname = '/aj_notes_local';
  notes.DATABASE_URL = notesDb.toString(); notes.AUTH_URL = 'http://localhost:3003'; notes.AUTH_TRUST_HOST = 'true';
  notes.ALLOWED_EMAIL = owner;
  writeFileSync(resolve(root, '.local/notes.env'), `APP_CONFIG=${JSON.stringify(notes)}\n`, { mode: 0o600 });
  notesConfigured = true;
}
if (!registry.apps.some(app => app.id === 'notes')) registry.apps.push({id:'notes',name:'AJ Notes',description:'Private notes, diagrams, and AI summaries.',url:null,repository:'aj-notes',icon:'book-open',status:'unverified',enabled:true});
const localUrls = {health:'http://localhost:3000',journal:'http://localhost:3001',...(notesConfigured ? {notes:'http://localhost:3003'} : {})};
for (const app of registry.apps) {
  if (localUrls[app.id]) { app.url = localUrls[app.id]; app.status = 'available'; }
}
const launcherEnv = parseEnv(readFileSync(resolve(root, '.env'), 'utf8'));
launcherEnv.AJ_APPS_CONFIG = JSON.stringify(registry);
launcherEnv.AJ_LOCAL_DEVELOPMENT = 'true';
writeFileSync(resolve(root, '.env'), Object.entries(launcherEnv).map(([key, value]) => {
  if (/[\r\n']/.test(value)) throw new Error(`Unsupported environment value: ${key}`);
  return `${key}='${value}'`;
}).join('\n') + '\n', { mode: 0o600 });
console.log('Local Docker configuration prepared. Production registry and app environment files were not changed.');
