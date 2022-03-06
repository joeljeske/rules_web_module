import { FC } from "react";

export const Button: FC<{ onClick: () => void }> = ({ onClick }) => {
  return <button onClick={onClick}>Hello</button>;
};
