import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LandingPage from '../pages/landing.tsx';
import AppLayout from '../layout/app-layout.tsx';
import DashBoard from '../pages/dashboard.tsx';
import Auth from '../pages/auth.tsx';
import Link from '../pages/redirect-link.tsx';
const router= createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/link/:id",
        element: <Link />,
      },
    ]
  }
])

function App() {

  return <RouterProvider router={router} />
}

export default App
