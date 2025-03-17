import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dog } from '@/types';

// Define the shape of the context
interface FavoriteContextType {
  favorites: Dog[];
  matchedDog: Dog | null;
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId: string) => void;
  setMatchedDog: (dog: Dog | null) => void;
  clearFavorites: () => void;
  isFavorite: (dogId: string) => boolean;
}

// Create the context with a default value
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Create a provider component
interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider = ({ children }: FavoriteProviderProps) => {
  // State for favorites
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDogState] = useState<Dog | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('favorite-dogs-storage');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.state) {
          if (parsedData.state.favorites) {
            setFavorites(parsedData.state.favorites);
          }
          if (parsedData.state.matchedDog) {
            setMatchedDogState(parsedData.state.matchedDog);
          }
        }
      } catch (e) {
        console.error('Failed to parse saved favorites data', e);
      }
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    const storageObj = {
      state: { 
        favorites,
        matchedDog
      },
      version: 0,
    };
    localStorage.setItem('favorite-dogs-storage', JSON.stringify(storageObj));
  }, [favorites, matchedDog]);

  // Add favorite function
  const addFavorite = (dog: Dog) => {
    if (!favorites.some(fav => fav.id === dog.id)) {
      setFavorites(prev => [...prev, dog]);
    }
  };

  // Remove favorite function
  const removeFavorite = (dogId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== dogId));
  };

  // Set matched dog function
  const setMatchedDog = (dog: Dog | null) => {
    setMatchedDogState(dog);
  };

  // Clear favorites function
  const clearFavorites = () => {
    setFavorites([]);
    setMatchedDogState(null);
  };

  // Check if dog is favorite
  const isFavorite = (dogId: string) => {
    return favorites.some(fav => fav.id === dogId);
  };

  // Create the context value object
  const contextValue: FavoriteContextType = {
    favorites,
    matchedDog,
    addFavorite,
    removeFavorite,
    setMatchedDog,
    clearFavorites,
    isFavorite
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};

// Custom hook to use the favorite context
export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};
