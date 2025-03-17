// Dog interface as per API specification
export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

// Location interface as per API specification
export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

// Coordinates interface as per API specification
export interface Coordinates {
  lat: number
  lon: number
}

// Auth related types
export interface LoginRequest {
  name: string
  email: string
}

// Dog search related types
export interface DogSearchParams {
  breeds?: string[]
  zipCodes?: string[]
  ageMin?: number
  ageMax?: number
  size?: number
  from?: number
  sort?: string
}

export interface DogSearchResponse {
  resultIds: string[]
  total: number
  next?: string
  prev?: string
}

// Location search related types
export interface LocationSearchParams {
  city?: string
  states?: string[]
  geoBoundingBox?: {
    top?: Coordinates
    left?: Coordinates
    bottom?: Coordinates
    right?: Coordinates
    bottom_left?: Coordinates
    top_left?: Coordinates
    bottom_right?: Coordinates
    top_right?: Coordinates
  }
  size?: number
  from?: number
}

export interface LocationSearchResponse {
  results: Location[]
  total: number
}

// Match related types
export interface MatchResponse {
  match: string
}

// User state
export interface User {
  name: string
  email: string
  isLoggedIn: boolean
}

// Sort options
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface SortOption {
  field: 'breed' | 'name' | 'age'
  direction: SortDirection
}

// Pagination state
export interface PaginationState {
  currentPage: number
  totalPages: number
  next: string | null
  prev: string | null
}
