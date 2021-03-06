// @ts-ignore: no types exist for this package
// import {} from "@jsenv/importmap";
import { link, promises } from "fs";

async function main([out, bom]: string[]) {
  const bomContents = await promises.readFile(bom, "utf-8");

  const linkedImportmap: any = { imports: {}, scopes: {}, depcache: {} };

  await Promise.all(
    bomContents.split("\n").map(async (importmap) => {
      if (!importmap) return;

      const importmapContents = await promises.readFile(importmap, "utf8");
      const importmapPartial = JSON.parse(importmapContents);

      Object.entries(importmapPartial.imports).forEach(([name, def]) => {
        if (name in linkedImportmap.imports) {
          // TODO more descriptive
          throw new Error(
            `[MODULE_CONFLICT] Conflicting module definitions for "${name}"`
          );
        }
        linkedImportmap.imports[name] = def;
      });
      Object.entries(importmapPartial.scopes).forEach(([name, def]) => {
        if (name in linkedImportmap.scopes) {
          // TODO more descriptive
          throw new Error(
            `[MODULE_CONFLICT] Conflicting scope definitions for "${name}"`
          );
        }
        linkedImportmap.scopes[name] = def;
      });
      Object.entries(importmapPartial.depcache).forEach(([name, def]) => {
        if (name in linkedImportmap.depcache) {
          // TODO more descriptive
          throw new Error(
            `[MODULE_CONFLICT] Conflicting depcache definitions for "${name}"`
          );
        }
        linkedImportmap.depcache[name] = def;
      });
    })
  );

  await promises.writeFile(
    out,
    JSON.stringify(linkedImportmap, null, 2),
    "utf8"
  );
}

main(process.argv.slice(2)).catch((err) => {
  console.error(err);
  process.exit(1);
});
