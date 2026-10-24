const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

exports.load = function load(file, mocks = {}, globals = {}) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(js, { exports, console, process, AbortSignal, ...globals, require(name) {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name === '@/lib/daypack-offers') return load('lib/daypack-offers.ts');
    return require(name);
  }});
  return exports;
};
