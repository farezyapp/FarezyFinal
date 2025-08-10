import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number, unit: 'km' | 'mi' = 'mi'): string {
  if (unit === 'km') {
    return `${distance.toFixed(1)} km`;
  } else {
    // Convert km to miles (1 km ≈ 0.621371 mi)
    const miles = distance * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
}

/**
 * Format time duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min`;
  }
}

/**
 * Calculate a color based on a value within a range
 * Returns a color from green (low) to red (high)
 */
export function getColorForValue(
  value: number, 
  min: number, 
  max: number
): string {
  const ratio = (value - min) / (max - min);
  const hue = (1 - ratio) * 120; // 120 is green, 0 is red
  return `hsl(${hue}, 80%, 45%)`;
}

/**
 * Add delay to simulate network requests in development
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
