// Exercise the actual route code without network access or production credentials.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const response = { NextResponse: { json: (body, options = {}) => ({ body, status: 200, ...options }) } };
function load(file, dependencies = {}, env = {}) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }, reportDiagnostics: true });
  assert.equal(compiled.diagnostics?.length || 0, 0);
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, require: name => {
    if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  }, process: { env }, Date, console: { error() {}, warn() {} } }, { filename: file });
  return module.exports;
}
async function main() {
  const guard = load("lib/preorder-availability.ts");
  const boundary = Date.parse("2027-01-25T06:00:00Z");
  for (const [time, approval, expected] of [[boundary - 1, "true", false], [boundary, "true", true], [boundary + 1, undefined, false], [boundary + 1, "false", false], [boundary + 1, "TRUE", false], [boundary + 1, "true", true]]) {
    assert.equal(guard.canCreatePreorder(time, approval), expected);
  }
  let stripeCalls = 0;
  let parsedBody = 0;
  const checkout = load("app/api/checkout/route.ts", { "next/server": response, "@/lib/preorder-availability": guard, "@/lib/stripe": { getStripe: () => { stripeCalls++; throw new Error("Stripe must not be reached"); } } });
  const paused = await checkout.POST({ json: () => { parsedBody++; throw new Error("Body must not be read"); } });
  assert.equal(paused.status, 503);
  assert.equal(paused.body.code, "PREORDERS_PAUSED");
  assert.equal(paused.headers["Cache-Control"], "no-store");
  assert.equal(stripeCalls, 0);
  assert.equal(parsedBody, 0);
  console.log("PASS: checkout date/readiness boundaries and fail-closed POST before parsing or Stripe.");

  const calls = [];
  let providerOK = true;
  const dependencies = { "next/server": response, "@/lib/klaviyo": { subscribeToKlaviyo: async (...args) => { calls.push(args); return { ok: providerOK }; } } };
  const request = data => ({ json: async () => data });
  const unconfigured = load("app/api/subscribe/route.ts", dependencies);
  assert.equal((await unconfigured.POST(request({ email: "invalid" }))).status, 400);
  assert.equal((await unconfigured.POST(request({ email: "test@example.com" }))).status, 503);
  assert.equal(calls.length, 0);
  const configured = load("app/api/subscribe/route.ts", dependencies, { NEXT_PUBLIC_KLAVIYO_LIST_ID: "test-list", KLAVIYO_PRIVATE_API_KEY: "test-key" });
  assert.equal((await configured.POST(request({ email: " test@example.com ", source: "development_updates" }))).status, 200);
  assert.equal(calls[0][0], "test@example.com");
  assert.equal(calls[0][1].newsletter_signup_source, "development_updates");
  assert.deepEqual(Object.keys(calls[0][1]).sort(), ["newsletter_last_requested_at", "newsletter_signup_source"]);
  for (const key of ["reservation_status", "first_seen_at", "source"]) assert.equal(key in calls[0][1], false);
  providerOK = false;
  assert.equal((await configured.POST(request({ email: "test@example.com", source: "x".repeat(100) }))).status, 502);
  assert.equal(calls[1][1].newsletter_signup_source.length, 80);
  console.log("PASS: signup validates, fails honestly, and never overwrites reservation or original acquisition metadata.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
