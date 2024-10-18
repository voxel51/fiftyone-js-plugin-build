import { nodeExternals } from "rollup-plugin-node-externals";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  plugins: [nodeExternals()],
  build: {
    lib: {
      entry: "index.ts",
      name: "@voxel51/fiftyone-js-plugin-build",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(pkg.devDependencies || {})],
    },
  },
});
