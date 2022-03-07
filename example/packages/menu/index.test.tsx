import { Menu } from "./index";
import { render } from "@testing-library/react";
import { Suspense } from "react";

it("should mount", async () => {
  const { getByText } = render(
    <Suspense fallback="Loading...">
      <Menu>Welcome!</Menu>
    </Suspense>
  );
  getByText("Welcome!");

  getByText("Hide Menu").click();
  getByText("Show Menu");

  expect(() => getByText("Welcome!")).toThrow;
});
