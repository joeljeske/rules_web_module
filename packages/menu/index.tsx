import { Button } from "rh/packages/button";
import { FC, useState } from "react";

export const Menu: FC = () => {
  const [state, setState] = useState(true);
  return (
    <div>
      {state && <h1>Menu</h1>}
      <Button onClick={() => setState((prev) => !prev)} />
    </div>
  );
};
