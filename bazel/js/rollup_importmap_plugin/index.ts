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
  generateBundle(outputOptions, bundle, isWrite) {
    if (!opts.outputDir) {
      throw new Error("ImportmapPlugin expected output.dir to be set");
    }
    const bundleDir = "/" + opts.outputDir;

    const files = Object.entries(bundle);
    const importMap: any = {
      imports: {} as any,
      scopes: {} as any,
      deps: {} as any,
    };

    // First, generate hashes of all the filenames, so we know where to put them
    for (const [, info] of files) {
      if (info.type === "chunk") {
        const contentHash = hash(info.code);
        if (opts.optimized) {
          info.fileName = `${contentHash}.js`;
        } else {
          let prettyFileName = info.name;
          if (info.isEntry) {
            const prettyModuleName = opts.moduleName.replace(/\//g, "__");
            if (prettyFileName == "index") {
              prettyFileName = "";
            }
            prettyFileName = prettyModuleName + prettyFileName;
          }
          info.fileName = `${prettyFileName}.${contentHash}.js`;
        }
      }
    }

    for (const [, info] of files) {
      const filePath = path.join(bundleDir, info.fileName);

      if (info.type === "chunk") {
        // All entry points go into the "imports" portion
        if (info.isEntry) {
          const chunkName = info.name === "index" ? "" : info.name;
          const moduleName = path.join(opts.moduleName, chunkName);
          importMap.imports[moduleName] = filePath;
        }
        // All chunks are allowed to have scopes if they have internal private deps
        const deps = [...info.imports, ...info.dynamicImports];
        const scopes: any = {};
        let hasScope = false;
        for (const dep of deps) {
          if (dep in bundle) {
            hasScope = true;
            scopes[path.join(filePath, "..", dep)] = path.join(
              bundleDir,
              bundle[dep].fileName
            );
          }
        }
        if (hasScope) {
          importMap.scopes[filePath] = scopes;
        }

        // Save all the deps and their namedImports in the importMap
        importMap.deps[filePath] = {
          imports: Object.assign(
            {},
            // dynamic imports don't have the exports used on them
            Object.fromEntries(info.dynamicImports.map((dep) => [dep, []])),
            info.importedBindings
          ),
          exports: info.exports,
        };
      }
    }

    this.emitFile({
      type: "asset",
      fileName: opts.importmapFilename,
      source: JSON.stringify(importMap, null, 2),
    });
  },
});
