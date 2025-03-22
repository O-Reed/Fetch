import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, Search, Menu, X, LogOut, Award, MapPin } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useLogout } from "@/apis/auth/useLogout";
import { getUser } from "@/apis/auth/useLogin";

import { useFavorite } from "@/contexts/FavoriteContext";
import { Button } from "@/components/ui/button";


const Navigation = () => {
  const { logout } = useLogout();
  const { name: username } = getUser();
  const { favorites, matchedDog } = useFavorite();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [favoritesCount, setFavoritesCount] = useState(favorites.length);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(
    () => {
      setFavoritesCount(favorites.length);
    },
    [favorites]
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/search" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Fetch</span>
            </NavLink>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? "border-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                <div className="flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </div>
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? "border-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                  {favoritesCount > 0 &&
                    <span className="ml-1 flex h-5 min-w-[20px] w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>}
                </div>
              </NavLink>
              {matchedDog &&
                <NavLink
                  to="/match"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
                >
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>Your Match</span>
                  </div>
                </NavLink>}
              {/* <NavLink
                to="/locations"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? "border-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Locations</span>
                </div>
              </NavLink> */}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center">
              <span className="text-sm text-gray-600 mr-4">
                Hello, {username}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen
                  ? <X className="block h-6 w-6" aria-hidden="true" />
                  : <Menu className="block h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen &&
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                  ? "bg-primary-50 border-primary text-primary-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </div>
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                  ? "bg-primary-50 border-primary text-primary-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
                {favoritesCount > 0 &&
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                  </span>}
              </div>
            </NavLink>
            {matchedDog &&
              <NavLink
                to="/match"
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                    ? "bg-primary-50 border-primary text-primary-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Your Match</span>
                </div>
              </NavLink>}
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                  ? "bg-primary-50 border-primary text-primary-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Locations</span>
              </div>
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {username}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>}
    </nav>
  );
};

export default Navigation;
