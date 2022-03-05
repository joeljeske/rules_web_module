import { render } from "@testing-library/react";
import { App } from "./App";

it("should render", () => {
  const { getByText } = render(<App />);
  getByText("Hello, World");
});
