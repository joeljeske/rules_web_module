import { FC, lazy, Suspense } from "react";
import { Menu } from "rh/packages/menu";

const AssetLink = lazy(async () => {
  const assetUrl = await import.meta.resolve(
    // module_name: static
    // relative path: assets/asset.txt
    "static/assets/asset.txt"
  );
  return {
    default: () => (
      <a href={assetUrl} target="_blank">
        Download Asset
      </a>
    ),
  };
});

export const App: FC = () => {
  return (
    <Suspense fallback="Loading...">
      <h1>Hello, World</h1>
      <Menu />

      <AssetLink />
    </Suspense>
  );
};
