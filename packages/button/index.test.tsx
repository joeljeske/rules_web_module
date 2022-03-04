import main, { Button } from "./index";
import React from "react";
import { render } from "@testing-library/react";

it("should pass", () => {
  expect(main).toEqual("main");
});

it("should mount", () => {
  const { getByText } = render(<Button />);
  getByText("Hello");
});
