import sourcemaps from "rollup-plugin-sourcemaps";
import replace from "@rollup/plugin-replace";
// import commonjs from '@rollup/plugin-commonjs';
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
  plugins: [sourcemaps(), importmapPlugin(), nodeResolve()],
};
