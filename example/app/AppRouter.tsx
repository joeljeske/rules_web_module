import { FC, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Menu } from "rh/example/packages/menu";
import { AssetPage } from "./AssetPage";

const About = lazy(() => import("rh/example/routes/about"));

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Menu>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="asset">Download Asset</Link>
            </li>
            <li>
              <Link to="about">About</Link>
            </li>
          </ul>
        </Menu>

        <Routes>
          <Route path="about" element={<About />} />
          <Route path="asset" element={<AssetPage />} />
          <Route
            index
            element={
              <div>
                <h1>Home Page</h1>
                Welcome to the example app
              </div>
            }
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};
