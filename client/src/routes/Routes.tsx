import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SigninPage from "../components/auth/SigninPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/common/Layout";
import dashboardLoader from "../loaders/dashboardLoader";
import Dashboard from "../components/dashboard/Dashboard";
import { sessionLoader } from "../loaders/sessionsLoader";
import SessionsManagerPage from "../components/sessionsManager/SessionManagerPage";
import SessionsPage from "../components/sessionEditor/SessionsPage";
import { sessionsManagerLoader } from "../loaders/sessionsManagerLoader";
import Loading from "../components/common/Loading";

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<Navigate to={"dashboard"} />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/loading" element={<Loading />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<SessionsManagerPage />}>
          <Route path="new" element={<SessionsPage />} />
          <Route path=":id" element={<SessionsPage />} />
          <Route path="manage" element={<SessionsManagerPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default MyRoutes;
