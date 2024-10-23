import nodeResolve from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";
import { promises as fsPromises } from "fs";
import { join } from "path";
import {
  BuildOptions,
  defineConfig as defineViteConfig,
  PluginOption,
} from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";

const FO_EXTERNALIZED_IGNORE_LIST = [
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
  "@fiftyone/looker-3d",
  "@mui/material",
  "styled-components",
  "recoil",
];

async function loadPackageJson(dir: string) {
  const pkgPath = join(dir, "package.json");
  const pkgData = await fsPromises.readFile(pkgPath, "utf-8");
  return JSON.parse(pkgData);
}

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
      if (
        source.startsWith("@fiftyone") &&
        !FO_EXTERNALIZED_IGNORE_LIST.includes(source)
      ) {
        const pkg = source.split("/")[1];
        const modulePath = `${FIFTYONE_DIR}/app/packages/${pkg}`;
        // @ts-ignore
        return this.resolve(modulePath, source, { skipSelf: true });
      }
      return null;
    },
  } as PluginOption;
}

// https://vitejs.dev/config/
/**
 *
 * @param dir root directory where package.json and vite.config.js are located. Usually you'll just want to pass `__dirname`.
 * Or, if you're using modules, you'll want to pass `dirname(fileURLToPath(import.meta.url))`.
 *
 * @param opts.forceBundleDependencies an array of either exact package names or regex patterns that you want to force bundle.
 * Use this for any third-party dependencies that you introduce in your plugin that are not part of the global scope.
 *
 * @param opts.buildConfigOverride override the default build config with your own options.
 *
 * @param opts.plugins additional plugins to include in the Vite config.
 */
export async function defineConfig(
  dir: string,
  opts: {
    buildConfigOverride?: BuildOptions;
    forceBundleDependencies?: Array<string | RegExp>;
    plugins?: PluginOption[];
  } = {}
) {
  const pkg = await loadPackageJson(dir);

  return defineViteConfig({
    mode: "development",
    plugins: [
      fiftyoneRollupPlugin(),
      nodeResolve(),
      react({ jsxRuntime: "classic" }),
      externalizeDeps({
        deps: true,
        devDeps: false,
        useFile: join(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: opts?.forceBundleDependencies ?? [],
      }),
      ...(opts?.plugins ?? []),
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
        external: FO_EXTERNALIZED_IGNORE_LIST,
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
            "styled-components": "__styled__",
          },
        },
      },
      ...(opts?.buildConfigOverride ?? {}),
    },
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    optimizeDeps: {
      exclude: ["react", "react-dom"],
    },
  });
}
