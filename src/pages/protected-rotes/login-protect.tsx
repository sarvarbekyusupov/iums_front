import { getItem } from "../../helpers";
import { Navigate, useLocation } from "react-router-dom"; 
import type { ProtectProps } from "@types";

const LoginProtect = ({ children }:ProtectProps) => {
  const isAuthenticated = getItem("access_token");
  const role = getItem('role');
  const location = useLocation();

  if (isAuthenticated) {
    if (location.pathname === "/" || location.pathname === "/") {
      return <Navigate to={`/${role}`} replace />;
    }
  } else {
    if (location.pathname !== "/") {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default LoginProtect;
