import sourcemaps from "rollup-plugin-sourcemaps";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";
import {
  importmapPlugin,
  importmapExternals,
} from "rh/bazel/js/rollup_importmap_plugin/plugin";

export default {
  output: {},
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
      optimized: false,
    }),
    sourcemaps(),
    nodeResolve(),
    replace({
      preventAssignment: true,
      values: {
        // TODO make env vars configurable, and respect "release" mode
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
    }),
  ],
};
