import { Button } from "./index";
import { render } from "@testing-library/react";

it("should mount", () => {
  const { getByText } = render(<Button />);
  getByText("Hello");
});
