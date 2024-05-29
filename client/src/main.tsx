import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import SigninPage from './components/SigninPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
// import ForgotPasswordPage from './components/ForgotPasswordPage';
// import ResetPasswordPage from './components/ResetPasswordPage';
// import SettingsPage from './components/SettingsPage';

// Houses the router for all pages. 
// TODO: some way to confirm authentication and either redirect to log-in or allow routing to desired page.
// TODO: components house page-specific UI, processed data fetching, and display of the data
const router = createBrowserRouter([
  {
    path: "*",  // Catch-all route for undefined paths
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
    path: "/dashboard",
    element: <Dashboard/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);