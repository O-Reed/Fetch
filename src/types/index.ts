import { z } from "zod";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address")
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface DogSearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export interface MatchResponse {
  match: string;
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc"
}

export interface SortOption {
  field: "breed" | "name" | "age";
  direction: SortDirection;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  next: string | null;
  prev: string | null;
}
export interface MultiSelectOption {
  value: string;
  label: string;
}
export interface DogWithLocation {
  dog: Dog;
  location: Location;
}
