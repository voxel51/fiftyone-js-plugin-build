import r from "@rollup/plugin-node-resolve";
import f from "@vitejs/plugin-react";
import { promises as a } from "node:fs";
import { join as o } from "node:path";
import { defineConfig as s } from "vite";
import { externalizeDeps as l } from "vite-plugin-externalize-deps";
async function m(n) {
  const e = o(n, "package.json"), i = await a.readFile(e, "utf-8");
  return JSON.parse(i);
}
function c() {
  const { FIFTYONE_DIR: n } = process.env;
  if (!n)
    throw new Error(
      "FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports."
    );
  return {
    name: "fiftyone-bundle-private-packages",
    enforce: "pre",
    resolveId: (e) => {
      if (e.startsWith("@fiftyone")) {
        const i = e.split("/")[1], t = `${n}/app/packages/${i}`;
        return this.resolve(t, e, { skipSelf: !0 });
      }
      return null;
    }
  };
}
async function v(n, e = {}) {
  const i = await m(n);
  return s({
    mode: "development",
    plugins: [
      c(),
      r(),
      f({ jsxRuntime: "classic" }),
      l({
        deps: !0,
        devDeps: !1,
        useFile: o(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: (e == null ? void 0 : e.forceBundleDependencies) ?? []
      }),
      ...(e == null ? void 0 : e.plugins) ?? []
    ],
    build: {
      minify: !0,
      lib: {
        entry: o(n, i.main),
        name: i.name,
        fileName: (t) => `index.${t}.js`,
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
      ...(e == null ? void 0 : e.buildConfigOverride) ?? {}
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
