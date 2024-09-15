import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../common/Loading";
import { initAuth0Client } from "../../services/auth0Client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const auth0Client = await initAuth0Client();

      try {
        const isAuth = await auth0Client.isAuthenticated();
        setIsAuthenticated(isAuth);
      } catch (error) {
        // Handle error
        console.error("Error checking authentication", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/signin" replace />;
  }
};

export default ProtectedRoute;
