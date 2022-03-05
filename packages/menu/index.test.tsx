import { Menu } from "./index";
import { render } from "@testing-library/react";

it("should mount", () => {
  const { getByText } = render(<Menu />);
  getByText("Menu");
  getByText("Hello");
});
