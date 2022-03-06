import "rh/bazel/js/env/inject";
import sourcemaps from "rollup-plugin-sourcemaps";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";
import {
  importmapPlugin,
  importmapExternals,
} from "rh/bazel/js/rollup_importmap_plugin/plugin";

export default async () => ({
  output: {
    format: process.env.JS_BUNDLE_FORMAT,
  },
  onwarn(warning) {
    // TODO: add exceptions for allowed warnings
    throw new Error(warning.message);
  },
  external: importmapExternals({
    includes: process.env.IMPORTMAP_INCLUDES?.split(",") || [],
  }),
  plugins: [
    importmapPlugin({
      moduleName: process.env.IMPORTMAP_MODULE_NAME,
      importmapFilename: "importmap.json",
      outputDir: process.env.IMPORTMAP_OUTPUT_DIR,
      optimized: process.env.NODE_ENV === "production",
    }),
    sourcemaps(),
    nodeResolve(),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      },
    }),
    process.env.NODE_ENV === "production"
      ? (await import("rollup-plugin-esbuild")).minify()
      : {},
  ],
});
