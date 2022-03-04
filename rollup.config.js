import sourcemaps from "rollup-plugin-sourcemaps";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";

import * as path from "path";
import * as crypto from "crypto";

const hash = (content) => {
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex")
    .substring(0, 12);
};

const importmapPlugin = () => ({
  name: "importmapPlugin",
  generateBundle(options, bundle) {
    const importMap = { imports: {}, scopes: {} };
    Object.entries(bundle).forEach(([fileName, info]) => {
      info.fileName = `${info.name}.${hash(info.code)}.js`;

      if (info.type === "chunk") {
        const chunkName = info.name === "index" ? "" : info.name;
        const moduleName = path.join(
          process.env.IMPORTMAP_MODULE_NAME,
          chunkName
        );
        importMap.imports[moduleName] =
          "/" +
          path.join(
            process.env.IMPORTMAP_MODULE_NAME,
            process.env.IMPORTMAP_OUTPUT_DIR,
            info.fileName
          );
      }
    });

    this.emitFile({
      type: "asset",
      fileName: "importmap.json",
      source: JSON.stringify(importMap, null, 2),
    });
  },
});

export default {
  output: {},
  onwarn(warning) {
    // TODO: add exceptions for allowed warnings
    throw new Error(warning.message);
  },
  external(source, importer, isResolved) {
    // If no importer, then its included, its the main script
    if (!importer) {
      return false;
    }
    if (source.startsWith(".")) {
      return false;
    }

    const includes = (process.env.IMPORTMAP_INCLUDES || "").split(",");
    // TODO: add fuzzy matching / regex matching
    const shouldBeIncluded = includes.some((incl) => incl === importer);
    return shouldBeIncluded;
  },
  plugins: [
    sourcemaps(),
    importmapPlugin(),
    nodeResolve(),
    replace({
      preventAssignment: true,
      values: {
        // TODO make env vars configurable, and respect "release" mode
        "process.env.NODE_ENV": "production",
      },
    }),
  ],
};
