# FiftyOne JS Plugin Build Utils

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-7289DA?logo=discord&logoColor=white)](https://discord.gg/fiftyone-community)
[![Hugging Face](https://img.shields.io/badge/Hugging_Face-purple?style=flat&logo=huggingface)](https://huggingface.co/Voxel51)
[![Voxel51 Blog](https://img.shields.io/badge/Voxel51_Blog-ff6d04?style=flat)](https://voxel51.com/blog)
[![Newsletter](https://img.shields.io/badge/Newsletter-BE5B25?logo=mail.ru&logoColor=white)](https://share.hsforms.com/1zpJ60ggaQtOoVeBqIZdaaA2ykyk)
[![LinkedIn](https://img.shields.io/badge/In-white?style=flat&label=Linked&labelColor=blue)](https://www.linkedin.com/company/voxel51)
[![Twitter](https://img.shields.io/badge/Twitter-000000?logo=x&logoColor=white)](https://x.com/voxel51)
[![Medium](https://img.shields.io/badge/Medium-12100E?logo=medium&logoColor=white)](https://medium.com/voxel51)

</div>

This repository contains utilities for building a FiftyOne JS plugin.

## Getting Started

You can find a hello world JS plugin in the [@voxel51/hello-world-plugin-js](https://github.com/voxel51/hello-world-plugin-js) repo.

## Design
The build utilities are designed to be as simple as possible. The main goal is to provide a single function that can be called to get a Vite config object that can be used to build a JS plugin. The function takes in the path to the plugin's directory and an optional object that can be used to override the default Vite config.

This repo uses ESM but it's transpiled to both ESM and CommonJS so it can be used in both ESM and CommonJS projects.

### Bundling and Externalization

All pacakges declared in the `dependecies` of your plugin's `package.json` are externalized, except for packages starting with `@fiftyone/`, `@mui/material`, `recoil`, `react`, `react-dom`, and `styled-components`. This is because these packages are expected to be provided by the host application.

Note: if you encounter problems with `@mui/material`, you can bundle it in by setting `opts.forceBundleMui`.
Doing this might have consequences on the theming of the plugin, so it's recommended to avoid it if possible.