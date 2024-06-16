import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SessionPage from "./components/sessionDetails/SessionsPage";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SigninPage from "./components/auth/SigninPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./components/Dashboard";
import { Provider } from "react-redux";
import store from './store/store';

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
    path: "*",
    element: <Navigate to={"/dashboard"} />,
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
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "sessions/:id",
        element: <SessionPage/>,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);