import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Dog } from "@/types";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "fetch_favorites";
const STORAGE_VERSION = 1;

interface FavoriteState {
  favorites: Dog[];
  matchedDog: Dog | null;
}

interface StorageData {
  state: FavoriteState;
  version: number;
}

interface FavoriteContextType extends FavoriteState {
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId: string) => void;
  setMatchedDog: (dog: Dog | null) => void;
  clearFavorites: () => void;
  isFavorite: (dogId: string) => boolean;
}


const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

const initialState: FavoriteState = {
  favorites: [],
  matchedDog: null
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FavoriteState>(initialState);
  const { toast } = useToast();


  useEffect(() => {
    const loadSavedState = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return;

        const parsed = JSON.parse(savedData) as StorageData;
        
        if (parsed.version !== STORAGE_VERSION) {
          throw new Error("Storage version mismatch");
        }

        setState(parsed.state);
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        toast({
          title: "Error Loading Favorites",
          description: "Your saved favorites could not be loaded",
          variant: "destructive",
        });
      }
    };

    loadSavedState();
  }, [toast]);

  useEffect(() => {
    const saveState = () => {
      try {
        const storageData: StorageData = {
          state,
          version: STORAGE_VERSION
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } catch (error) {
        toast({
          title: "Error Saving Favorites",
          description: "Your favorites could not be saved",
          variant: "destructive",
        });
      }
    };

    saveState();
  }, [state, toast]);
  const addFavorite = (dog: Dog) => {
    setState(prev => {
      if (prev.favorites.some(fav => fav.id === dog.id)) {
        return prev;
      }
      
      if (prev.favorites.length >= 100) {
        toast({
          title: "Favorites Limit Reached",
          description: "You can only favorite up to 100 dogs",
          variant: "destructive",
        });
        return prev;
      }

      return {
        ...prev,
        favorites: [...prev.favorites, dog]
      };
    });
  };


  const removeFavorite = (dogId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(fav => fav.id !== dogId),
      matchedDog: prev.matchedDog?.id === dogId ? null : prev.matchedDog
    }));
  };


  const setMatchedDog = (dog: Dog | null) => {
    setState(prev => ({
      ...prev,
      matchedDog: dog
    }));
  };


  const clearFavorites = () => {
    setState(initialState);
  };

  const isFavorite = (dogId: string): boolean => {
    return state.favorites.some(fav => fav.id === dogId);
  };

  const value: FavoriteContextType = {
    ...state,
    addFavorite,
    removeFavorite,
    setMatchedDog,
    clearFavorites,
    isFavorite
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};


export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  
  if (context === undefined) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  
  return context;
};
