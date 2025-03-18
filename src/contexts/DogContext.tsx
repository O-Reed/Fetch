import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dogApi } from '@/services/api';
import { Dog, DogSearchParams, DogSearchResponse, SortDirection } from '@/types';
import { useAuth } from './AuthContext';

// Simple, focused context type
interface DogContextType {
  dogs: Dog[];
  totalDogs: number;
  favorites: string[];
  isLoading: boolean;
  isDetailLoading: boolean;
  isDetailFetching: boolean; // Added to track background refetching
  detailStatus: 'loading' | 'error' | 'success'; // Added to track detailed status
  isInitialLoading: boolean; // Added to track initial loading state
  error: string | null;
  searchParams: DogSearchParams;
  setSearchParams: (params: Partial<DogSearchParams>) => void;
  toggleFavorite: (dogId: string) => void;
  fetchDogs: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  hasNextPage: boolean;
  setSortField: (field: 'breed' | 'name' | 'age') => void;
  setSortDirection: (direction: SortDirection) => void;
  currentPage: number;
  pageSize: number;
}

// Default search parameters
const defaultSearchParams: DogSearchParams = {
  breeds: [],
  zipCodes: [],
  ageMin: 0,
  ageMax: 20,
  from: 0,
  size: 25,
  sort: 'breed:asc'
};

// Create the context
const DogContext = createContext<DogContextType | undefined>(undefined);

// Provider component
export const DogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const {isAuthenticated} = useAuth(); // Ensure the user is authenticated
  const [searchParams, setSearchParamsState] = useState<DogSearchParams>(defaultSearchParams);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dog-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      return [];
    }
  });
  const [totalDogs, setTotalDogs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(25);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Extract current sort field and direction
  const [sortField, setSortFieldState] = useState<'breed' | 'name' | 'age'>('breed');
  const [sortDirection, setSortDirectionState] = useState<SortDirection>(SortDirection.ASC);

  // Initialize sort from searchParams
  useEffect(() => {
    if (searchParams.sort) {
      const [field, direction] = searchParams.sort.split(':');
      if (field && (field === 'breed' || field === 'name' || field === 'age')) {
        setSortFieldState(field);
      }
      if (direction && (direction === SortDirection.ASC || direction === SortDirection.DESC)) {
        setSortDirectionState(direction as SortDirection);
      }
    }
  }, []);

  // Dogs query
  const {
    data: searchResponse,
    isLoading,
    error: queryError,
    refetch
  } = useQuery<DogSearchResponse>({
    enabled: isAuthenticated === true, // Only run when explicitly true, not when null
    queryKey: ['dogSearch', searchParams],
    queryFn: async () => {
      try {
        // Search for dog IDs and total count
        return await dogApi.searchDogs(searchParams);
      } catch (error: any) {
        console.error('Error fetching dogs:', error);

        // Check if this is an authentication error
        if (error.response &&
            (error.response.status === 401 ||
             error.response.status === 403 ||
             (error.response.status === 200 && error.response.data && error.response.data.code === 403))) {
          console.error('Authentication error while searching dogs:', error);
        }

        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error.response &&
          (error.response.status === 401 ||
           error.response.status === 403 ||
           (error.response.status === 200 && error.response.data && error.response.data.code === 403))) {
        return false;
      }
      console.error('Error refetching dogs:', error);
      return failureCount < 3;
    }
  });

  // Query to fetch dog details
  const {
    data: dogs = [],
    error: dogsError,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    status: detailStatus,
  } = useQuery<Dog[]>({
    queryKey: ['dogDetails', searchResponse?.resultIds],
    enabled: !!searchResponse?.resultIds && searchResponse.resultIds.length > 0,
    queryFn: async () => {
      if (!searchResponse?.resultIds) return [];
      try {
        return await dogApi.getDogs(searchResponse.resultIds);
      } catch (error: any) {
        // Check if this is an authentication error
        if (error.response &&
            (error.response.status === 401 ||
             error.response.status === 403 ||
             (error.response.status === 200 && error.response.data && error.response.data.code === 403))) {
          console.error('Authentication error while fetching dog details:', error);
          return [];
        }
        console.error('Error fetching dog details:', error);
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error.response &&
          (error.response.status === 401 ||
           error.response.status === 403 ||
           (error.response.status === 200 && error.response.data && error.response.data.code === 403))) {
        return false;
      }
      return failureCount < 3;
    }
  });

  // Update total count when search results change
  useEffect(() => {
    if (searchResponse?.total !== undefined) {
      setTotalDogs(searchResponse.total);
    }
  }, [searchResponse]);

  // Update initial loading state when dogs data is fetched
  useEffect(() => {
    if (!isLoading && isInitialLoading && !isDetailLoading && !isDetailFetching) {
      setIsInitialLoading(false);
    }
  }, [isLoading, isDetailLoading, isDetailFetching, dogs]);

  // Update search parameters
  const setSearchParams = (params: Partial<DogSearchParams>) => {
    // Reset pagination when search criteria change (except when explicitly changing page)
    if (params.from === undefined &&
        (params.breeds !== undefined ||
         params.zipCodes !== undefined ||
         params.ageMin !== undefined ||
         params.ageMax !== undefined ||
         params.size !== undefined ||
         params.sort !== undefined)) {
      setSearchParamsState(prev => ({ ...prev, ...params, from: 0 }));
      setCurrentPage(1); // Reset current page to 1
    } else {
      setSearchParamsState(prev => ({ ...prev, ...params }));
    }
  };

  // Set the sort field
  const setSortField = (field: 'breed' | 'name' | 'age') => {
    setSortFieldState(field);
    setSearchParams({ sort: `${field}:${sortDirection}` });
  };

  // Set the sort direction
  const setSortDirection = (direction: SortDirection) => {
    setSortDirectionState(direction);
    setSearchParams({ sort: `${sortField}:${direction}` });
  };

  // Set the page number (pagination)
  const setPage = (page: number) => {
    if (page < 1) {
      console.warn('Invalid page number. Page must be at least 1.');
      page = 1;
    }
    const from = (page - 1) * pageSize;
    setSearchParamsState(prev => ({ ...prev, from }));
    setCurrentPage(page);
  };

  // Set the page size
  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setSearchParamsState(prev => ({ ...prev, size }));
    setPage(1); // Reset to first page when page size changes
  };

  // Toggle favorite status for a dog
  const toggleFavorite = (dogId: string) => {
    if (!dogId) {
      console.error('Cannot toggle favorite: Invalid dog ID');
      return;
    }

    setFavorites(prev => {
      const newFavorites = prev.includes(dogId)
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId];

      try {
        // Save to localStorage
        localStorage.setItem('dog-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }

      return newFavorites;
    });
  };

  // Manual fetch function
  const fetchDogs = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error manually fetching dogs:', error);
      throw error;
    }
  };

  // Context value
  const value: DogContextType = {
    dogs: dogs || [],
    totalDogs,
    favorites,
    isLoading,
    isDetailLoading,
    isDetailFetching,
    detailStatus: detailStatus as 'loading' | 'error' | 'success',
    isInitialLoading,
    error: queryError ? String(queryError) : dogsError ? String(dogsError) : null,
    searchParams,
    setSearchParams,
    toggleFavorite,
    fetchDogs,
    setPage,
    hasNextPage: ((searchParams.from ?? 0) + (searchParams.size ?? 25)) < totalDogs,
    setSortField,
    setSortDirection,
    currentPage,
    setPageSize,
    pageSize,
  };

  return (
    <DogContext.Provider value={value}>
      {children}
    </DogContext.Provider>
  );
};

// Custom hook
export const useDogContext = () => {
  const context = useContext(DogContext);
  if (!context) {
    throw new Error('useDogContext must be used within a DogProvider');
  }
  return context;
};
