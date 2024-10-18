# Fiftyone JS Plugin Build Utils

This repository contains utilities for building a Fiftyone JS plugin.

## Getting Started
In your JS plugin's `package.json`, add `@voxel51/fiftyone-js-plugin-build: *` as a dev dependency.
Then, in your vite config file, import the config definition from this package, like following:

```js
import {defineConfig} from "@voxel51/fiftyone-js-plugin-build";

// if you optionally want to bundle in third party dependencies,
// you can specify them here, either as names or as regexes
const myPluginThirdPartyDependencies = [
    "my-third-party-dependency",
    /my-other-third-party-dependency-.*/
];

export default defineConfig(__dirname, myPluginThirdPartyDependencies);
```