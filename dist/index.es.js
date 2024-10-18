import r from "@rollup/plugin-node-resolve";
import s from "@vitejs/plugin-react";
import { join as i } from "node:path";
import { defineConfig as f } from "vite";
import { externalizeDeps as p } from "vite-plugin-externalize-deps";
function a() {
  const { FIFTYONE_DIR: e } = process.env;
  if (!e)
    throw new Error(
      "FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports."
    );
  return {
    name: "fiftyone-bundle-private-packages",
    enforce: "pre",
    resolveId: (o) => {
      if (o.startsWith("@fiftyone")) {
        const t = o.split("/")[1], n = `${e}/app/packages/${t}`;
        return this.resolve(n, o, { skipSelf: !0 });
      }
      return null;
    }
  };
}
function d(e, o = []) {
  const t = require(i(e, "package.json"));
  return f({
    mode: "development",
    plugins: [
      a(),
      r(),
      s({ jsxRuntime: "classic" }),
      s(),
      p({
        deps: !0,
        devDeps: !1,
        useFile: i(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: o
      })
    ],
    build: {
      minify: !0,
      lib: {
        entry: i(e, t.main),
        name: t.name,
        fileName: (n) => `index.${n}.js`,
        formats: ["umd"]
      },
      rollupOptions: {
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "jsx-runtime": "jsx",
            "@fiftyone/state": "__fos__",
            "@fiftyone/plugins": "__fop__",
            "@fiftyone/operators": "__foo__",
            "@fiftyone/components": "__foc__",
            "@fiftyone/utilities": "__fou__",
            "@fiftyone/spaces": "__fosp__",
            "@mui/material": "__mui__",
            "styled-components": "__styled__"
          }
        }
      }
    },
    define: {
      "process.env.NODE_ENV": '"development"'
    },
    optimizeDeps: {
      exclude: ["react", "react-dom"]
    }
  });
}
export {
  d as defineConfig
};
