import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/login';
import SearchPage from '@/pages/search';
import FavoritesPage from '@/pages/favorites';
import MatchPage from '@/pages/match';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'match',
        element: <MatchPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
