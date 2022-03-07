import { Button } from "rh/example/packages/button";
import { FC, useState } from "react";

export const Menu: FC = ({ children }) => {
  const [state, setState] = useState(true);
  return (
    <div>
      <Button onClick={() => setState((prev) => !prev)}>
        {state ? "Hide Menu" : "Show Menu"}
      </Button>
      {state && children}
    </div>
  );
};
