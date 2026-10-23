import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeJsonLd } from '../src/data/json-ld.ts';

test('JSON-LD cannot terminate its script element and preserves text values', () => {
  const value = { name: '</script><script>alert(1)</script>', description: '<!-- <tag> & "quoted"' };
  const encoded = serializeJsonLd(value);
  assert.equal(encoded.includes('<'), false);
  assert.deepEqual(JSON.parse(encoded), value);
});
