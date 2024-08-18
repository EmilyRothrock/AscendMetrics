import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../common/Loading";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/signin" />;
  }
};

export default ProtectedRoute;
