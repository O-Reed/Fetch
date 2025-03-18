import axios from "axios";
import {
  Dog,
  DogSearchParams,
  DogSearchResponse,
  Location,
  LocationSearchParams,
  LocationSearchResponse,
  LoginRequest,
  MatchResponse
} from "@/types";

// Create an axios instance with the base URL and credentials configuration
const api = axios.create({
  // Use the Vite proxy instead of direct API URL
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

// Event for auth errors that components can listen to
export const AUTH_ERROR_EVENT = "fetch-auth-error";

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    // Check if the error has a response
    if (error.response) {
      // Check for authentication errors (401, 403, or 403 code with 200 status)
      if (
        error.response.status === 401 ||
        error.response.status === 403 ||
        (error.response.status === 200 &&
          error.response.data &&
          error.response.data.code === 403)
      ) {
        console.error("Authentication error: Cookie may be expired", error);

        // Dispatch a custom event that the app can listen for
        const authErrorEvent = new CustomEvent(AUTH_ERROR_EVENT, {
          detail: {
            status: error.response.status,
            message: "Authentication session expired. Please log in again.",
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(authErrorEvent);
      }
    } else if (error.request) {
      console.error("Request error: No response received", error);
    } else {
      console.error("Error setting up request", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth related API calls
export const authApi = {
  login: async (data: LoginRequest): Promise<void> => {
    try {
      await api.post("/auth/login", data);
      // Store login state
      localStorage.setItem(
        "fetch_auth_state",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          version: 1
        })
      );
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
      // Clear all app storage on logout
      const keysToKeep: string[] = []; // Add keys that should persist through logout
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("fetch_") && !keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
};

// Dog related API calls
export const dogApi = {
  getBreeds: async (): Promise<string[]> => {
    const response = await api.get<string[]>("/dogs/breeds");
    return response.data;
  },

  searchDogs: async (params: DogSearchParams): Promise<DogSearchResponse> => {
    const response = await api.get<DogSearchResponse>("/dogs/search", {
      params
    });
    return response.data;
  },

  getDogs: async (dogIds: string[]): Promise<Dog[]> => {
    const response = await api.post<Dog[]>("/dogs", dogIds);
    return response.data;
  },

  getMatch: async (dogIds: string[]): Promise<MatchResponse> => {
    const response = await api.post<MatchResponse>("/dogs/match", dogIds);
    return response.data;
  }
};

// Location related API calls
export const locationApi = {
  getLocations: async (zipCodes: string[]): Promise<Location[]> => {
    // Validate that we don't exceed the maximum of 100 ZIP codes
    if (zipCodes.length > 100) {
      throw new Error("Maximum of 100 ZIP codes allowed per request");
    }

    const response = await api.post<Location[]>("/locations", zipCodes);
    return response.data;
  },

  searchLocations: async (
    params: LocationSearchParams
  ): Promise<LocationSearchResponse> => {
    const response = await api.post<LocationSearchResponse>(
      "/locations/search",
      params
    );
    return response.data;
  }
};

export default api;
