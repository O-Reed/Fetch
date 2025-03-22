import Routes from "@/routes";
import { Toaster } from "@/components/ui/toaster";

import { FavoriteProvider } from "./contexts/FavoriteContext";
import { ErrorBoundary } from "react-error-boundary";

import "./styles/globals.css";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <FavoriteProvider>
        <Routes />
        <Toaster />
      </FavoriteProvider>
    </ErrorBoundary>
  );
}

export default App;
