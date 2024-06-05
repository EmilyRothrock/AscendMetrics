import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import SigninPage from './components/SigninPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import TrainingSessionPage from "./components/TrainingSessionPage";
// import ForgotPasswordPage from './components/ForgotPasswordPage';
// import ResetPasswordPage from './components/ResetPasswordPage';

// Houses the router for all pages. 
// TODO: loaders for data fetching
const router = createBrowserRouter([
  {
    path: "*",  // TODO: landing page
    element: <ErrorPage/>,
  },
  {
    path: "/signin",
    element: <SigninPage/>,
  },
  {
    path: "/signup",
    element: <SignupPage/>,
  },
  {
    path: "/forgot-password",
    element: <h1>this is the forgot password page</h1>,
  },
  {
    path: "/reset-password:",
    element: <h1>this is the reset password page</h1>,
  },
  {
    path: "/",
    element: <ProtectedRoute><Outlet /></ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "sessions",
        element: <TrainingSessionPage/>,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);