import builtinModules from "builtin-modules";

import ts2 from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import stripShebang from "rollup-plugin-strip-shebang";
import addShebang from "rollup-plugin-add-shebang";
import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";

import api from "./plugins/api";

import { bin, dependencies } from "./package.json";

const input = "src-bin/index.ts";

const runtimeDependencies = Object.keys(dependencies);
const external = [...builtinModules, ...runtimeDependencies];

let capturedShebang = null;

/** @type { import("rollup").RollupOptions } */
const config = {

  input,

  output: {
    file: bin,
    format: "cjs",
    sourcemap: false,
    esModule: false,
    interop: false,
  },

  external,

  plugins: [

    stripShebang({
      capture(shebangFromFile) {
        capturedShebang = shebangFromFile;
      },
    }),

    api("../src", __dirname),

    ts2({
      cacheRoot: ".cache/rpt2-cli",
      tsconfigOverride: {
        compilerOptions: {
          target: "esnext",
          module: "esnext",
          declaration: false,
        },
      },
    }),

    json(),

    babel({
      extensions: [".ts", ".js"],
      exclude: /node_modules/,
      babelrc: false,
      plugins: ["babel-plugin-transform-async-to-promises"],
    }),

    buble({
      exclude: /node_modules/,
      target: {
        node: 0.12,
      },
      objectAssign: true,
    }),

    addShebang({
      shebang: capturedShebang || "#!/usr/bin/env node",
      include: bin,
    }),

  ],

};

export default config;
