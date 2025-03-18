import Routes from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { DogProvider } from "@/contexts/DogContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoriteProvider } from "./contexts/FavoriteContext";
import { ErrorBoundary } from "react-error-boundary";

import "./styles/globals.css";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AuthProvider>
        <DogProvider>
          <FavoriteProvider>
            <Routes />
            <Toaster />
          </FavoriteProvider>
        </DogProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
