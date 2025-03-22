import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBreedName(breed?: string): string {
  if (!breed) return 'Unknown';

  return breed
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


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


export function formatZipCode(zipCode: string): string {
  return zipCode;
}
