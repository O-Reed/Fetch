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
// import LocationSearchPage from "@/pages/locations";
import { getUser } from "@/apis/auth/useLogin";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const user = getUser();

  if (!user) {
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
      }

      // {
      //   path: "locations",
      //   element: <LocationSearchPage />
      // }
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
