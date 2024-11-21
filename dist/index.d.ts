import { BuildOptions, PluginOption, UserConfig } from 'vite';
export type PluginPackageJson = {
    main: string;
    name: string;
    dependencies: Record<string, string>;
};
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
export declare function defineConfig(dir: string, opts?: {
    buildConfigOverride?: BuildOptions;
    forceBundleMui?: boolean;
    plugins?: PluginOption[];
    vite?: Omit<UserConfig, "plugins" | "build">;
}): Promise<UserConfig>;
