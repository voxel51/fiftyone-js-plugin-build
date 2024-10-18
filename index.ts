import nodeResolve from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";
import { join } from "path";
import { defineConfig as defineViteConfig, PluginOption } from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";

// import pkg from "../package.json" assert { type: "json" };

function fiftyoneRollupPlugin() {
  const { FIFTYONE_DIR } = process.env;

  if (!FIFTYONE_DIR) {
    throw new Error(
      `FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports.`
    );
  }

  return {
    name: "fiftyone-bundle-private-packages",
    enforce: "pre",
    resolveId: (source) => {
      if (source.startsWith("@fiftyone")) {
        const pkg = source.split("/")[1];
        const modulePath = `${FIFTYONE_DIR}/app/packages/${pkg}`;
        return this.resolve(modulePath, source, { skipSelf: true });
      }
      return null;
    },
  } as PluginOption;
}

// https://vitejs.dev/config/
/**
 *
 * @param {string} dir root directory where package.json and vite.config.js are located. Usually you'll just want to pass `__dirname`.
 * Or, if you're using modules, you'll want to pass `dirname(fileURLToPath(import.meta.url))`.
 *
 * @param {Array<string | RegExp>} forceBundleDependencies an array of either exact package names or regex patterns that you want to force bundle.
 * Use this for any third-party dependencies that you introduce in your plugin that are not part of the global scope.
 */
export function defineConfig(dir, forceBundleDependencies = []) {
  const pkg = require(join(dir, "package.json"));
  return defineViteConfig({
    mode: "development",
    plugins: [
      fiftyoneRollupPlugin(),
      nodeResolve(),
      react({ jsxRuntime: "classic" }),
      react(),
      externalizeDeps({
        deps: true,
        devDeps: false,
        useFile: join(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: forceBundleDependencies,
      }),
    ],
    build: {
      minify: true,
      lib: {
        entry: join(dir, pkg.main),
        name: pkg.name,
        fileName: (format) => `index.${format}.js`,
        formats: ["umd"],
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
            "styled-components": "__styled__",
          },
        },
      },
    },
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    optimizeDeps: {
      exclude: ["react", "react-dom"],
    },
  });
}
