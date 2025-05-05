import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import LandingPage from "../pages/landing";
import AppLayout from "../layout/app-layout";
import DashBoard from "../pages/dashboard";
import Auth from "../pages/auth";
import RedirectLink from "../pages/redirect-link";
import RequireAuth from "./components/required-auth";
import { AuthProvider } from "./context/UrlContext";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <DashBoard />
          </RequireAuth>
        ),
      },
      { path: "/auth", element: <Auth /> },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <RedirectLink />
          </RequireAuth>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
