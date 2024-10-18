import r from "@rollup/plugin-node-resolve";
import s from "@vitejs/plugin-react";
import { join as i } from "node:path";
import { defineConfig as a } from "vite";
import { externalizeDeps as f } from "vite-plugin-externalize-deps";
import { promises as p } from "node:fs";
async function m(e) {
  const t = i(e, "package.json"), o = await p.readFile(t, "utf-8");
  return JSON.parse(o);
}
function l() {
  const { FIFTYONE_DIR: e } = process.env;
  if (!e)
    throw new Error(
      "FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports."
    );
  return {
    name: "fiftyone-bundle-private-packages",
    enforce: "pre",
    resolveId: (t) => {
      if (t.startsWith("@fiftyone")) {
        const o = t.split("/")[1], n = `${e}/app/packages/${o}`;
        return this.resolve(n, t, { skipSelf: !0 });
      }
      return null;
    }
  };
}
async function v(e, t = []) {
  const o = await m(e);
  return a({
    mode: "development",
    plugins: [
      l(),
      r(),
      s({ jsxRuntime: "classic" }),
      s(),
      f({
        deps: !0,
        devDeps: !1,
        useFile: i(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: t
      })
    ],
    build: {
      minify: !0,
      lib: {
        entry: i(e, o.main),
        name: o.name,
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
  v as defineConfig
};
