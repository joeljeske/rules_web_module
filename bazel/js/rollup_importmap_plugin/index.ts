import { Plugin, ExternalOption } from "rollup";
import * as path from "path";
import * as crypto from "crypto";
import multimatch from "multimatch";

const hash = (content: string) => {
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex")
    .substring(0, 12);
};

export interface ImportmapExternalOpts {
  includes: string[];
}
export const importmapExternals = (
  opts: ImportmapExternalOpts
): ExternalOption => {
  return (source, importer) => {
    if (!importer) {
      // Allow default behavior for entry points
      return false;
    }

    if (
      source.startsWith("/") ||
      source.startsWith("./") ||
      source.startsWith("../")
    ) {
      // Force resolution for all relative lookups
      return false;
    }

    if (multimatch(source, opts.includes).length) {
      // Any matching the includes are allowed to be bundled
      return false;
    }

    // Consider all others to be external
    return true;
  };
};

export interface ImportmapPluginOpts {
  moduleName: string;
  importmapFilename: string;
  outputDir?: string;
  optimized: boolean;
}
export const importmapPlugin = (opts: ImportmapPluginOpts): Plugin => ({
  name: "importmapPlugin",
  generateBundle(outputOptions, bundle) {
    let bundleDir = opts.outputDir || "";
    if (!bundleDir) {
      throw new Error("ImportmapPlugin expected output.dir to be set");
    }

    const importMap: any = { imports: {}, scopes: {} };
    Object.entries(bundle).forEach(([fileName, info]) => {
      if (info.type === "chunk") {
        const filePrettyName = info.isEntry
          ? opts.moduleName.replace(/\//g, "__")
          : info.name;
        info.fileName = opts.optimized
          ? `${hash(info.code)}.js`
          : `${filePrettyName}.${hash(info.code)}.js`;

        const chunkName = info.name === "index" ? "" : info.name;
        const moduleName = path.join(opts.moduleName, chunkName);
        importMap.imports[moduleName] = path.join(
          "/",
          bundleDir,
          info.fileName
        );
      }
    });

    this.emitFile({
      type: "asset",
      fileName: opts.importmapFilename,
      source: JSON.stringify(importMap, null, 2),
    });
  },
});
