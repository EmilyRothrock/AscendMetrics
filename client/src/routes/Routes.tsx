import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "../components/common/LandingPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/common/Layout";
import dashboardLoader from "../loaders/dashboardLoader";
import Dashboard from "../components/dashboard/Dashboard";
import { sessionLoader } from "../loaders/sessionsLoader";
import SessionsManagerPage from "../components/sessionsManager/SessionManagerPage";
import { sessionsManagerLoader } from "../loaders/sessionsManagerLoader";
import Loading from "../components/common/Loading";
import TrainingSessionEditor from "../components/trainingSessionEditor/TrainingSessionEditor";

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/dashboard" />,
    },
    {
      path: "/signin",
      element: <LandingPage />,
    },
    {
      path: "/loading",
      element: <Loading />,
    },
    {
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
          loader: dashboardLoader,
        },
        {
          path: "/sessions",
          children: [
            {
              path: "new",
              element: <TrainingSessionEditor />,
            },
            {
              path: ":id",
              element: <TrainingSessionEditor />,
              loader: ({ params }) => {
                return sessionLoader(params.id);
              },
            },
            {
              path: "manage",
              element: <SessionsManagerPage />,
              loader: sessionsManagerLoader,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/dashboard" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
