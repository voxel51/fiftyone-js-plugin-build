"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("@rollup/plugin-node-resolve"),f=require("@vitejs/plugin-react"),a=require("node:fs"),o=require("node:path"),c=require("vite"),l=require("vite-plugin-externalize-deps"),r=["@fiftyone/components","@fiftyone/operators","@fiftyone/state","@fiftyone/utilities","@fiftyone/spaces","@fiftyone/plugins"];async function u(n){const e=o.join(n,"package.json"),i=await a.promises.readFile(e,"utf-8");return JSON.parse(i)}function _(){const{FIFTYONE_DIR:n}=process.env;if(!n)throw new Error("FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports.");return{name:"fiftyone-bundle-private-packages",enforce:"pre",resolveId:e=>{if(e.startsWith("@fiftyone")&&!r.includes(e)){const i=e.split("/")[1],t=`${n}/app/packages/${i}`;return this.resolve(t,e,{skipSelf:!0})}return null}}}async function p(n,e={}){const i=await u(n);return c.defineConfig({mode:"development",plugins:[_(),s(),f({jsxRuntime:"classic"}),l.externalizeDeps({deps:!0,devDeps:!1,useFile:o.join(process.cwd(),"package.json"),except:(e==null?void 0:e.forceBundleDependencies)??[]}),...(e==null?void 0:e.plugins)??[]],build:{minify:!0,lib:{entry:o.join(n,i.main),name:i.name,fileName:t=>`index.${t}.js`,formats:["umd"]},rollupOptions:{external:r,output:{globals:{react:"React","react-dom":"ReactDOM","jsx-runtime":"jsx","react/jsx-runtime":"jsx","@fiftyone/state":"__fos__","@fiftyone/plugins":"__fop__","@fiftyone/operators":"__foo__","@fiftyone/components":"__foc__","@fiftyone/utilities":"__fou__","@fiftyone/spaces":"__fosp__","@mui/material":"__mui__","styled-components":"__styled__"}}},...(e==null?void 0:e.buildConfigOverride)??{}},define:{"process.env.NODE_ENV":'"development"'},optimizeDeps:{exclude:["react","react-dom"]}})}exports.defineConfig=p;
