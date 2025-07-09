import { getItem } from "../../helpers";
import { Navigate } from "react-router-dom";
import type { ProtectProps } from "@types";

const LayoutProtect = ({ children }: ProtectProps) => {
  const isAuthenticated = getItem("access_token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default LayoutProtect;