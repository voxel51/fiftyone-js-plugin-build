# Fiftyone JS Plugin Build Utils

This repository contains utilities for building a Fiftyone JS plugin.

## Getting Started

You can find a hello world JS plugin in the [@voxel51/hello-world-plugin-js](https://github.com/voxel51/hello-world-plugin-js) repo.

## Design
The build utilities are designed to be as simple as possible. The main goal is to provide a single function that can be called to get a Vite config object that can be used to build a JS plugin. The function takes in the path to the plugin's directory and an optional object that can be used to override the default Vite config.

This repo uses ESM but it's transpiled to both ESM and CommonJS so it can be used in both ESM and CommonJS projects.