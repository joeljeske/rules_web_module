import { FC, lazy } from "react";

const Child = lazy(() => import("./lazy"));

export const Button: FC<{ onClick: () => void }> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} style={{ color: "green" }}>
      <div style={{ display: "inline-block", width: "20px" }}>
        <Child />
      </div>
      {children}
    </button>
  );
};
