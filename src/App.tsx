import Routes from '@/routes';
import { Toaster } from '@/components/ui/toaster';
import { DogProvider } from '@/contexts/DogContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <DogProvider>
        <FavoriteProvider>
          <Routes />
          <Toaster />
        </FavoriteProvider>
      </DogProvider>
    </AuthProvider>
  );
}

export default App;
