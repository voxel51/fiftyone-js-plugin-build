import l from "@rollup/plugin-node-resolve";
import s from "@vitejs/plugin-react";
import { promises as _ } from "node:fs";
import { join as f } from "node:path";
import { defineConfig as c } from "vite";
import { externalizeDeps as m } from "vite-plugin-externalize-deps";
const a = [
  "@fiftyone/components",
  "@fiftyone/operators",
  "@fiftyone/state",
  "@fiftyone/utilities",
  "@fiftyone/spaces",
  "@fiftyone/plugins",
  "@fiftyone/aggregations",
  "@fiftyone/core",
  "@fiftyone/embeddings",
  "@fiftyone/looker",
  "@fiftyone/map",
  "@fiftyone/playback",
  "@fiftyone/spotlight",
  "@fiftyone/flashlight",
  "@fiftyone/looker-3d"
], r = [
  ...a,
  "styled-components",
  "recoil",
  "react",
  "react-dom",
  "@mui/material"
];
async function d(n) {
  const e = f(n, "package.json"), i = await _.readFile(e, "utf-8");
  return JSON.parse(i);
}
const u = (n, e = !1) => {
  const i = Object.keys(n.dependencies), o = i.filter(
    (t) => !r.includes(t) && !t.startsWith("@fiftyone")
  );
  return e && i.includes("@mui/material") && o.push("@mui/material"), o;
};
function y() {
  const { FIFTYONE_DIR: n } = process.env;
  if (!n)
    throw new Error(
      "FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports."
    );
  return {
    name: "fiftyone-bundle-private-packages",
    enforce: "pre",
    resolveId: (e) => {
      if (e.startsWith("@fiftyone") && !a.includes(e)) {
        const i = e.split("/")[1], o = `${n}/app/packages/${i}`;
        return this.resolve(o, e, { skipSelf: !0 });
      }
      return null;
    }
  };
}
async function b(n, e = {}) {
  const i = await d(n), o = u(
    i,
    e == null ? void 0 : e.forceBundleMui
  );
  return console.log(
    "Bundling the following third party dependencies:",
    o.join(", ")
  ), c({
    mode: "development",
    plugins: [
      y(),
      l(),
      s({ jsxRuntime: "classic" }),
      m({
        deps: !1,
        devDeps: !1,
        useFile: f(process.cwd(), "package.json"),
        include: e != null && e.forceBundleMui ? r.filter((t) => t !== "@mui/material") : r
      }),
      ...(e == null ? void 0 : e.plugins) ?? []
    ],
    build: {
      minify: !0,
      lib: {
        entry: f(n, i.main),
        name: i.name,
        fileName: (t) => `index.${t}.js`,
        formats: ["umd"]
      },
      rollupOptions: {
        output: {
          globals: {
            react: "React",
            recoil: "recoil",
            "react-dom": "ReactDOM",
            "jsx-runtime": "jsx",
            "react/jsx-runtime": "jsx",
            "@fiftyone/state": "__fos__",
            "@fiftyone/plugins": "__fop__",
            "@fiftyone/operators": "__foo__",
            "@fiftyone/components": "__foc__",
            "@fiftyone/utilities": "__fou__",
            "@fiftyone/spaces": "__fosp__",
            "@fiftyone/aggregations": "__foa__",
            "@fiftyone/core": "__focore__",
            "@fiftyone/embeddings": "__foe__",
            "@fiftyone/looker": "__fol__",
            "@fiftyone/map": "__fom__",
            "@fiftyone/playback": "__fopb__",
            "@fiftyone/spotlight": "__fosl__",
            "@fiftyone/flashlight": "__fof__",
            "@fiftyone/looker-3d": "__fol3d__",
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
    },
    ...(e == null ? void 0 : e.vite) ?? {}
  });
}
export {
  b as defineConfig
};
