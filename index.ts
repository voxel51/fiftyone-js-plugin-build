import nodeResolve from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";
import { promises as fsPromises } from "fs";
import { join } from "path";
import {
  BuildOptions,
  defineConfig as defineViteConfig,
  PluginOption,
  UserConfig,
} from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export type PluginPackageJson = {
  main: string;
  name: string;
  dependencies: Record<string, string>;
};

const FO_PACKAGES = [
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
];

const FO_EXTERNALIZED_IGNORE_LIST = [
  ...FO_PACKAGES,
  "styled-components",
  "recoil",
  "react",
  "react-dom",
  "@mui/material",
];

async function loadPackageJson(dir: string) {
  const pkgPath = join(dir, "package.json");
  const pkgData = await fsPromises.readFile(pkgPath, "utf-8");
  return JSON.parse(pkgData) as PluginPackageJson;
}

const getNonExternalizedDependencies = (
  packageJson: PluginPackageJson,
  forceBundleMui = false
) => {
  const allDependencies = Object.keys(packageJson.dependencies);
  const filteredDependencies = allDependencies.filter(
    (dep) =>
      !FO_EXTERNALIZED_IGNORE_LIST.includes(dep) && !dep.startsWith("@fiftyone")
  );

  if (forceBundleMui && allDependencies.includes("@mui/material")) {
    filteredDependencies.push("@mui/material");
  }

  return filteredDependencies;
};

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
      if (source.startsWith("@fiftyone") && !FO_PACKAGES.includes(source)) {
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
 * @param opts.buildConfigOverride override the default build config with your own options.
 *
 * @param opts.forceBundleMui if true, will bundle MUI components. By default, MUI components are externalized.
 *
 * @param opts.plugins additional plugins to include in the Vite config.
 *
 * @param opts.vite additional Vite config options (except `build` and `plugins`, which are handled separately).
 */
export async function defineConfig(
  dir: string,
  opts: {
    buildConfigOverride?: BuildOptions;
    forceBundleMui?: boolean;
    plugins?: PluginOption[];
    vite?: Omit<UserConfig, "plugins" | "build">;
  } = {}
) {
  const pkg = await loadPackageJson(dir);

  const nonExternalizedDependencies = getNonExternalizedDependencies(
    pkg,
    opts?.forceBundleMui
  );

  console.log(
    "Bundling the following third party dependencies:",
    nonExternalizedDependencies.join(", ")
  );

  return defineViteConfig({
    mode: "development",
    plugins: [
      fiftyoneRollupPlugin(),
      nodeResolve(),
      react({ jsxRuntime: "classic" }),
      externalizeDeps({
        deps: false,
        devDeps: false,
        useFile: join(process.cwd(), "package.json"),
        include: opts?.forceBundleMui
          ? FO_EXTERNALIZED_IGNORE_LIST.filter((dep) => dep !== "@mui/material")
          : FO_EXTERNALIZED_IGNORE_LIST,
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
    ...(opts?.vite ?? {}),
  });
}
