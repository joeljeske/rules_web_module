import { FC, Suspense } from "react";
import { Menu } from "rh/packages/menu";

export const App: FC = () => {
  return (
    <Suspense fallback="Loading...">
      <h1>Hello, World</h1>
      <Menu />
    </Suspense>
  );
};
