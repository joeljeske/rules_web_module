import { Button } from "rh/example/packages/button";

export const AssetPage = () => {
  const downloadAsset = async () => {
    window.open(
      // @ts-expect-error: is not supported. Need to generate proper import resolutions
      await import.meta.resolve(
        // module_name: static
        // relative path: assets/asset.txt
        "static/assets/asset.txt"
      ),
      "_blank"
    );
  };

  return (
    <div>
      <h1>Asset Download</h1>
      <Button onClick={downloadAsset}>Download the Asset</Button>
    </div>
  );
};
