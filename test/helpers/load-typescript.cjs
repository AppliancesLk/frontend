const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function loadTypeScript(filename) {
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  const evaluate = vm.runInNewContext(
    `(function(require,module,exports){${source}\n})`,
    { URL, URLSearchParams },
  );
  evaluate(
    (specifier) =>
      loadTypeScript(path.resolve(path.dirname(filename), `${specifier}.ts`)),
    module,
    module.exports,
  );
  return module.exports;
}

module.exports = { loadTypeScript };
