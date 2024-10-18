# Fiftyone JS Plugin Build Utils

This repository contains utilities for building a Fiftyone JS plugin.

## Getting Started
In your JS plugin's `package.json`, add `@voxel51/fiftyone-js-plugin-build` as a dev dependency.
Then, in your vite config file, import the config definition from this package, like following:

```js
import { defineConfig } from "@voxel51/fiftyone-js-plugin-build";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = __dirname;

// if you optionally want to bundle in third party dependencies,
// you can specify them here, either as names or as regexes
const myPluginThirdPartyDependencies = [
    "my-third-party-dependency",
    /my-other-third-party-dependency-.*/
];

export default defineConfig(dir, {
  buildConfigOverride: { sourcemap: true, forceBundleDependencies: myPluginThirdPartyDependencies },
});


export default defineConfig(dir, myPluginThirdPartyDependencies);
```

## Design
The build utilities are designed to be as simple as possible. The main goal is to provide a single function that can be called to get a Vite config object that can be used to build a JS plugin. The function takes in the path to the plugin's directory and an optional object that can be used to override the default Vite config.

This repo uses ESM but it's transpiled to both ESM and CommonJS so it can be used in both ESM and CommonJS projects.