import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import ForgotPasswordPage from './components/ForgotPasswordPage';
// import ResetPasswordPage from './components/ResetPasswordPage';

// Houses the router for all pages. 
// TODO: loaders for data fetching
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SessionPage from "./components/sessions/SessionsPage";
import ProtectedLayout from "./components/common/ProtectedLayout";
import ErrorPage from "./components/ErrorPage";
import TrainingSessionPage from "./components/TrainingSessionPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SigninPage from "./components/auth/SigninPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./components/Dashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#ff5722',
    },
  },
});

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
    element: <ProtectedRoute><ProtectedLayout /></ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "sessions",
        element: <TrainingSessionPage/>,
      },
      {
        path:"sessions/new",
        element: <SessionPage/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);