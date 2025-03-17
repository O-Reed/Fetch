import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a breed name to be more readable
 * Converts "breed_name" to "Breed Name"
 */
export function formatBreedName(breed: string): string {
  return breed
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns a descriptive text based on dog's age
 */
export function getAgeText(age: number): string {
  if (age < 1) {
    return 'Puppy';
  } else if (age < 3) {
    return 'Young';
  } else if (age < 8) {
    return 'Adult';
  } else {
    return 'Senior';
  }
}

/**
 * Formats a zip code with proper spacing
 * For example: "12345" to "12345"
 */
export function formatZipCode(zipCode: string): string {
  return zipCode;
}
