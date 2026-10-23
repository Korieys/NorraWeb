const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadPage(session) {
  const calls = [];
  const js = ts.transpileModule(fs.readFileSync('app/reserved/page.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require(name) {
    if (name === 'react/jsx-runtime') return require(name);
    if (name === 'next/link') return { default: () => null };
    if (name === 'next/navigation') return { redirect: path => { throw new Error(`redirect:${path}`); } };
    if (name === '@/lib/stripe') return { getStripe: () => session && { checkout: { sessions: { retrieve: async id => { calls.push(id); return session; } } } } };
    if (name === '@/lib/skus') return { SKUS: { '170': { color: { text: 'test-color' }, protein: 'Test pack' } } };
    if (name.startsWith('@/components/')) return { Button: () => null, Nav: () => null, Footer: () => null };
    throw new Error(name);
  }});
  return { page: exports.default, calls };
}

test('reservation confirmation awaits framework search parameters and verifies paid checkout', async () => {
  const f = loadPage({ payment_status: 'paid', metadata: { sku: '170' } });
  const page = await f.page({ searchParams: Promise.resolve({ session_id: 'synthetic-paid-session' }) });
  assert.ok(page);
  assert.deepEqual(f.calls, ['synthetic-paid-session']);
});

test('query-only development bypass cannot display a confirmed preorder', async () => {
  const f = loadPage(null);
  await assert.rejects(f.page({ searchParams: Promise.resolve({ dev: '1', sku: '170' }) }), /redirect:\/cancelled/);
  assert.equal(f.calls.length, 0);
});

for (const payment_status of ['unpaid', 'no_payment_required']) {
  test(`${payment_status} checkout cannot display a confirmed preorder`, async () => {
    const f = loadPage({ payment_status });
    await assert.rejects(f.page({ searchParams: Promise.resolve({ session_id: 'synthetic-unpaid-session' }) }), /redirect:\/cancelled/);
  });
}
