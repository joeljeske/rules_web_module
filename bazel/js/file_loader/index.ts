import * as fs from "fs";
import * as crypto from "crypto";
import path from "path";

const getFileHash = (filePath: string) =>
  new Promise<string>((resolve, reject) => {
    const fd = fs.createReadStream(filePath);
    const hash = crypto.createHash("sha1");
    hash.setEncoding("hex");

    fd.on("end", function () {
      hash.end();
      resolve(hash.read().substring(0, 12));
    });

    hash.on("error", reject);
    fd.on("error", reject);
    fd.pipe(hash);
  });

async function main(args: string[]) {
  const [outDir, manifestName, moduleName, bundleDir, ...assets] = args;
  const optimized = process.env.NODE_ENV === "production";
  const importMap: any = { scopes: {}, imports: {} };
  await Promise.all(
    assets.map(async (filePath) => {
      const hash = await getFileHash(filePath);
      const basename = path.basename(filePath);
      const ext = path.extname(basename);
      let outputName = hash + ext;
      if (!optimized) {
        outputName = path.basename(basename, ext) + "." + outputName;
      }
      await fs.promises.copyFile(filePath, path.join(outDir, outputName));
      importMap.imports[path.join(moduleName, basename)] = path.join(
        "/",
        bundleDir,
        outputName
      );
    })
  );

  await fs.promises.writeFile(
    path.join(outDir, manifestName),
    JSON.stringify(importMap, null, 2),
    "utf8"
  );
}

main(process.argv.slice(2)).catch((err) => {
  console.error(err);
  process.exit(1);
});
