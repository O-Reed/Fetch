import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Login from "@/pages/login";
import SearchPage from "@/pages/search";
import FavoritesPage from "@/pages/favorites";
import MatchPage from "@/pages/match";
import LocationSearchPage from "@/pages/locations";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated === null) {
    return null;
  }
  // If isAuthenticated is null or false, redirect to login
  if (isAuthenticated !== true) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "favorites",
        element: <FavoritesPage />
      },
      {
        path: "match",
        element: <MatchPage />
      },
      {
        path: "locations",
        element: <LocationSearchPage />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
