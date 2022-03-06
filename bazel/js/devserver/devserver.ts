import express from "express";
import * as fs from "fs";

const {
  PORT = "3000",
  WEB_MODULE_IMPORTMAP,
  WEB_MODULE_INDEX,
  WEB_MODULE_LOADERS,
  IBAZEL_LIVERELOAD_URL,
} = process.env;

if (!WEB_MODULE_IMPORTMAP) {
  throw new Error("$WEB_MODULE_IMPORTMAP must be set to a valid importmap");
}
if (!WEB_MODULE_INDEX) {
  throw new Error("$WEB_MODULE_INDEX must be set to a html template");
}
if (!WEB_MODULE_LOADERS) {
  throw new Error(
    "$WEB_MODULE_LOADERS must be set to a CSV of loaders to inject into the template"
  );
}

const createIndexHtml = async () => {
  const [indexFile, importmapJson] = await Promise.all([
    fs.promises.readFile(WEB_MODULE_INDEX, "utf-8"),
    fs.promises.readFile(WEB_MODULE_IMPORTMAP, "utf-8"),
  ]);
  const importmap = JSON.parse(importmapJson).imports;
  const loaderScripts = WEB_MODULE_LOADERS.split(",").map(
    (loader) => `<script src="${importmap[loader]}"></script>`
  );
  const importMapScriptSnippet = `
    ${
      IBAZEL_LIVERELOAD_URL
        ? `<script src="${IBAZEL_LIVERELOAD_URL}"></script>`
        : ""
    }
    ${loaderScripts.join("\n")}
    <script type="systemjs-importmap">${importmapJson}</script>
    `;

  return indexFile.replace("</head>", importMapScriptSnippet + "</head>");
};

const app = express();

app.use(express.static(process.cwd()));
app.use(async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Be helpful and don't respond to missing static assets with a HTML response
  // req.accepts() doesn't work here since some assets accept */*
  if (!(req.header("accept") || "").includes("text/html")) {
    return next();
  }
  try {
    const data = await createIndexHtml();
    res.status(200);
    res.send(data);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log("Server listening at http://localhost:3000/");
});
