import { Outlet } from "react-router-dom";
import MyAppBar from "./MyAppBar";

const Layout: React.FC = () => {
  return (
    <>
      <MyAppBar />
      <Outlet />
    </>
  );
};

export default Layout;
