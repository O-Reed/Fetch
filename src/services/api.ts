import axios from 'axios';
import {
  Dog,
  DogSearchParams,
  DogSearchResponse,
  Location,
  LocationSearchParams,
  LocationSearchResponse,
  LoginRequest,
  MatchResponse
} from '@/types';

// Create an axios instance with the base URL and credentials configuration
const api = axios.create({
  // Use the Vite proxy instead of direct API URL
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error has a response
    if (error.response) {
      // If it's a 403 error with status 200 (unusual but matches your scenario)
      if (error.response.status === 200 && error.response.data && error.response.data.code === 403) {
        console.error('Authentication error: Possible cookie issue', error);
        // You might add additional handling here
      }
    } else if (error.request) {
      console.error('Request error: No response received', error);
    } else {
      console.error('Error setting up request', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth related API calls
export const authApi = {
  login: async (data: LoginRequest): Promise<void> => {
    try {
      await api.post('/auth/login', data);
      // Store login state
      localStorage.setItem('fetch_auth_state', JSON.stringify({
        timestamp: new Date().toISOString(),
        version: 1
      }));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      // Clear all app storage on logout
      const keysToKeep: string[] = []; // Add keys that should persist through logout
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('fetch_') && !keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

// Dog related API calls
export const dogApi = {
  getBreeds: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/dogs/breeds');
    return response.data;
  },
  
  searchDogs: async (params: DogSearchParams): Promise<DogSearchResponse> => {
    const response = await api.get<DogSearchResponse>('/dogs/search', { params });
    return response.data;
  },
  
  getDogs: async (dogIds: string[]): Promise<Dog[]> => {
    const response = await api.post<Dog[]>('/dogs', dogIds);
    return response.data;
  },
  
  getMatch: async (dogIds: string[]): Promise<MatchResponse> => {
    const response = await api.post<MatchResponse>('/dogs/match', dogIds);
    return response.data;
  }
};

// Location related API calls
export const locationApi = {
  getLocations: async (zipCodes: string[]): Promise<Location[]> => {
    const response = await api.post<Location[]>('/locations', zipCodes);
    return response.data;
  },
  
  searchLocations: async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
    const response = await api.post<LocationSearchResponse>('/locations/search', params);
    return response.data;
  }
};

export default api;
