import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge Tailwind CSS classes conditionally
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs))
}
