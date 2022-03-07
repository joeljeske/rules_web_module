import { Menu } from "./index";
import { render } from "@testing-library/react";
import { Suspense } from "react";

it("should mount", () => {
  const { getByText } = render(
    <Suspense fallback="Loading...">
      <Menu />
    </Suspense>
  );
  getByText("Menu");
  getByText("Hello");
});
