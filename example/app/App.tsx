import { FC, Suspense } from "react";
import { AppRouter } from "./AppRouter";

export const App: FC = () => {
  return (
    <Suspense fallback="Loading...">
      <h1>Welcome to the example app</h1>
      <AppRouter />
    </Suspense>
  );
};
