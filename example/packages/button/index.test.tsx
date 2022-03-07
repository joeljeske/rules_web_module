import { Button } from "./index";
import { render } from "@testing-library/react";
import { Suspense } from "react";

it("should mount", () => {
  const { getByText } = render(
    <Suspense fallback="Loading...">
      <Button onClick={() => null}>Button Text</Button>
    </Suspense>
  );
  getByText("Button Text");
});
