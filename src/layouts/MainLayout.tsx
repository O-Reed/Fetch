import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Fetch Dog Adoption - Find your
            perfect furry companion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
