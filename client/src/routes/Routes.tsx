import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../components/auth/LandingPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/common/Layout";
import dashboardLoader from "../loaders/dashboardLoader";
import Dashboard from "../components/dashboard/Dashboard";
import { sessionLoader } from "../loaders/sessionsLoader";
import SessionsManagerPage from "../components/sessionsManager/SessionManagerPage";
import { sessionsManagerLoader } from "../loaders/sessionsManagerLoader";
import Loading from "../components/common/Loading";
import SessionPage from "../components/sessionEditor/SessionPage";

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<Navigate to={"/dashboard"} />} />
      <Route path="/signin" element={<LandingPage />} />
      <Route path="/loading" element={<Loading />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions">
          <Route path="new" element={<SessionPage />} />
          <Route path=":id" element={<SessionPage />} />
          <Route path="manage" element={<SessionsManagerPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default MyRoutes;
