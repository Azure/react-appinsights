import cjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import multiEntry from "rollup-plugin-multi-entry";
import nodeBuiltins from "rollup-plugin-node-builtins";
import nodeResolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import viz from "rollup-plugin-visualizer";

const pkg = require("./package.json");
const depNames = Object.keys(pkg.dependencies);
const input = "dist-esm/src/index.js";

export function nodeConfig(test = false) {
  const externalNodeBuiltins = ["events"];
  const baseConfig = {
    input: input,
    external: depNames.concat(externalNodeBuiltins),
    output: { file: "dist/index.js", format: "cjs", sourcemap: true },
    plugins: [
      json(),
      replace({
        delimiters: ["", ""],
        values: {
          // replace dynamic checks with if (true) since this is for node only.
          // Allows rollup's dead code elimination to be more aggressive.
          "if (isNode)": "if (true)"
        }
      }),
      nodeResolve({ preferBuiltins: true }),
      cjs()
    ]
  };

  if (test) {
    // entry point is every test file
    baseConfig.input = "dist-esm/test/**/*.js";
    baseConfig.plugins.unshift(multiEntry({ exports: false }));

    // different output file
    baseConfig.output.file = "test-dist/index.js";

    // mark assert as external
    baseConfig.external.push("assert");
  } else {
    baseConfig.plugins.push(uglify());
  }

  return baseConfig;
}

export function browserConfig(test = false) {
  const baseConfig = {
    input: input,
    external: ["ms-rest-js"],
    output: {
      file: "browser/index.js",
      format: "umd",
      name: "ExampleClient",
      sourcemap: true,
      globals: { "ms-rest-js": "msRest" }
    },
    plugins: [
      json(),
      replace(
        // ms-rest-js is externalized so users must include it prior to using this bundle.
        {
          delimiters: ["", ""],
          values: {
            // replace dynamic checks with if (false) since this is for
            // browser only. Rollup's dead code elimination will remove
            // any code guarded by if (isNode) { ... }
            "if (isNode)": "if (false)"
          }
        }
      ),
      nodeResolve({
        preferBuiltins: false,
        browser: true
      }),
      cjs({
        namedExports: {
          events: ["EventEmitter"],
          "node_modules/@microsoft/applicationinsights-core-js/browser/applicationinsights-core-js.min.js": [
            "AppInsightsCore",
            "LoggingSeverity",
            "_InternalMessageId",
            "CoreUtils",
            "DiagnosticLogger"
          ],
          "node_modules/react/index.js": ["Children", "Component", "PropTypes", "createElement"],
          "node_modules/react-dom/index.js": ["render"]
        }
      }),
      nodeBuiltins(),
      viz({ filename: "browser/browser-stats.html", sourcemap: false })
    ],
    onwarn
  };

  if (test) {
    baseConfig.input = "dist-esm/test/**/*.js";
    baseConfig.plugins.unshift(multiEntry({ exports: false }));
    baseConfig.output.file = "test-browser/index.js";
  } else {
    baseConfig.plugins.push(uglify());
  }

  return baseConfig;
}

function onwarn(warning, warn) {
  if (warning.code === "CIRCULAR_DEPENDENCY" && warning.importer.indexOf("duplex.js") > -1) {
    // circular dependencies in Stream (required by create-hmac via rollup-plugin-node-builtins)
    // These should be ignored per https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/39
    return;
  }
  warn(warning);
}
