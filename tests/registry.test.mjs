import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { validateRegistry } from '../packages/app-launcher/registry.js';
const source = JSON.parse(parseEnv(readFileSync(new URL('../.env.example', import.meta.url), 'utf8')).AJ_APPS_CONFIG);
test('unverified deployments are not assigned invented URLs', () => { assert.equal(validateRegistry(source).apps.length, 2); for (const app of source.apps) assert.equal(app.url, null); });
test('rejects duplicate IDs', () => assert.throws(() => validateRegistry({...source, apps:[source.apps[0],source.apps[0]]})));
for (const url of ['http://example.com','https://user:pass@example.com','javascript:alert(1)']) test(`rejects unsafe URL ${url}`, () => assert.throws(() => validateRegistry({...source,apps:[{...source.apps[0],url}]})));
test('available apps need a verified URL', () => assert.throws(() => validateRegistry({...source,apps:[{...source.apps[0],status:'available'}]})));
test('rejects unknown status and icon', () => {for(const field of ['status','icon']) assert.throws(() => validateRegistry({...source,apps:[{...source.apps[0],[field]:'unknown'}]}));});

test('localhost HTTP requires an explicit local development opt-in', () => {
 const local = {...source,apps:[{...source.apps[0],status:'available',url:'http://localhost:3000'}]};
 assert.throws(()=>validateRegistry(local));
 assert.equal(validateRegistry(local,{allowLocalhost:true}).apps[0].url,'http://localhost:3000');
 assert.throws(()=>validateRegistry({...local,apps:[{...local.apps[0],url:'http://example.com'}]},{allowLocalhost:true}));
});
