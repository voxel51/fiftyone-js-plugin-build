import r from "@rollup/plugin-node-resolve";
import s from "@vitejs/plugin-react";
import { promises as f } from "node:fs";
import { join as i } from "node:path";
import { defineConfig as a } from "vite";
import { externalizeDeps as p } from "vite-plugin-externalize-deps";
async function l(n) {
  const e = i(n, "package.json"), t = await f.readFile(e, "utf-8");
  return JSON.parse(t);
}
function m() {
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
        const t = e.split("/")[1], o = `${n}/app/packages/${t}`;
        return this.resolve(o, e, { skipSelf: !0 });
      }
      return null;
    }
  };
}
async function v(n, e = {}) {
  const t = await l(n);
  return a({
    mode: "development",
    plugins: [
      m(),
      r(),
      s({ jsxRuntime: "classic" }),
      p({
        deps: !0,
        devDeps: !1,
        useFile: i(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: (e == null ? void 0 : e.forceBundleDependencies) ?? []
      })
    ],
    build: {
      minify: !0,
      lib: {
        entry: i(n, t.main),
        name: t.name,
        fileName: (o) => `index.${o}.js`,
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
