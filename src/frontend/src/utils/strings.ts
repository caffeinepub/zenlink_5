// String normalization utilities for case/trim-insensitive comparison

/**
 * Normalize a string for comparison by trimming whitespace and converting to lowercase
 */
export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Check if an array contains a string (case/trim-insensitive)
 */
export function containsNormalized(array: string[], value: string): boolean {
  const normalized = normalizeString(value);
  return array.some(item => normalizeString(item) === normalized);
}
