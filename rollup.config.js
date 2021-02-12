import autoExternal from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import makeDot from "./src/rollup/makeDot.js";

export default [
  {
    // pretend client JS bundle
    input: "src/componentA/a1.js",
    output: {
      file: "bundles/a.bundled.js",
      sourcemap: "inline",
      format: "esm"
    },
    plugins: [
      resolve(),
      commonjs(),

      // here's where the magic happens: our plugin consumes the bundle data and emits a diagram
      makeDot({ graphPath: "graphs/componentA", filenamesOnly: true })
    ]
  },

  {
    // another pretend client JS bundle
    input: "src/componentA/a3.js",
    output: {
      file: "bundles/a3.bundled.js",
      sourcemap: "inline",
      format: "esm"
    },
    plugins: [
      resolve(),
      commonjs(),
      makeDot({graphPath: "graphs/componantA3", filenamesOnly: true})
    ]
  },

  {
    // pretend Electron project
    input: "src/componentB/b1.js",
    output: {
      file: "/dev/null", // If you don't actually need the bundle, just throw it away! I guess on Windows this would be "NUL" or something.
      format: "esm"
    },
    external: ["electron"],
    plugins: [
      commonjs(),
      autoExternal(),
      makeDot({ graphPath: "graphs/componentB", filenamesOnly: true })
    ]
  },

  {
    // another pretend Electron project
    input: "src/componentC/c1.js",
    output: {
      file: "/dev/null",
      format: "esm"
    },
    external: ["electron"],
    plugins: [
      commonjs(),
      autoExternal(),
      makeDot({graphPath: "graphs/componentC", filenamesOnly: true})
    ]
  }
];
