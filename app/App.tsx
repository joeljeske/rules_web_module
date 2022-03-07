import { FC, lazy, Suspense } from "react";
import { Menu } from "rh/packages/menu";

const AssetLink = lazy(async () => {
  const assetUrl = await import.meta.resolve("assets/asset.txt");
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
