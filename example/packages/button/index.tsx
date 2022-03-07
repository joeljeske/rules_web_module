import { FC, lazy } from "react";

const Child = lazy(() => import("./lazy"));

export const Button: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Hello
      <Child />
    </button>
  );
};
