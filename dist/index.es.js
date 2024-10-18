import a from "@rollup/plugin-node-resolve";
import s from "@vitejs/plugin-react";
import { join as i } from "node:path";
import { defineConfig as f } from "vite";
import { externalizeDeps as p } from "vite-plugin-externalize-deps";
import { promises as m } from "node:fs";
async function l(e) {
  const t = i(e, "package.json"), o = await m.readFile(t, "utf-8");
  return JSON.parse(o);
}
function c() {
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
async function k(e, t = [], o) {
  const n = await l(e);
  return f({
    mode: "development",
    plugins: [
      c(),
      a(),
      s({ jsxRuntime: "classic" }),
      s(),
      p({
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
        entry: i(e, n.main),
        name: n.name,
        fileName: (r) => `index.${r}.js`,
        formats: ["umd"]
      },
      rollupOptions: {
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "jsx-runtime": "jsx",
            "react/jsx-runtime": "jsx",
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
      },
      ...o.buildConfigOverride
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
  k as defineConfig
};
