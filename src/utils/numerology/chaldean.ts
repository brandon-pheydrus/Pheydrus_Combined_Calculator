/**
 * Chaldean Numerology Calculator
 * Maps letters to numbers and calculates values with master number preservation
 */

const CHALDEAN_MAPPING: Record<string, number> = {
  A: 1,
  I: 1,
  J: 1,
  Q: 1,
  Y: 1,
  B: 2,
  K: 2,
  R: 2,
  C: 3,
  G: 3,
  L: 3,
  S: 3,
  D: 4,
  M: 4,
  T: 4,
  E: 5,
  H: 5,
  N: 5,
  X: 5,
  U: 6,
  V: 6,
  W: 6,
  O: 7,
  Z: 7,
  F: 8,
  P: 8,
};

/**
 * Reduces a number to single digit or preserves master numbers (11, 22, 33)
 */
function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    let sum = 0;
    while (num) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

/**
 * Reduces a number to single digit ONLY (1-9), without preserving master numbers
 * Used for personal year calculations where master numbers should be reduced
 */
export function reduceToSingleDigitOnly(num: number): number {
  while (num > 9) {
    let sum = 0;
    while (num) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

/**
 * Finds numerology value of a single string
 * Adds up letter values, preserves master numbers
 */
function findNumerology(inputString: string): number {
  // Check for master number strings
  if (inputString === '11' || inputString === '22' || inputString === '33') {
    return Number(inputString);
  }

  let total = 0;

  for (const char of inputString) {
    if (!isNaN(Number(char))) {
      // Direct digit addition
      total += Number(char);
    } else {
      // Letter conversion via Chaldean mapping
      total += CHALDEAN_MAPPING[char.toUpperCase()] || 0;
    }
  }

  // Preserve master numbers
  if (total === 11 || total === 22 || total === 33) {
    return total;
  }

  // Reduce to single digit
  return reduceToSingleDigit(total);
}

/**
 * Main Chaldean Numerology Calculator
 * Calculates value of multiple strings (space-separated)
 * Preserves master numbers (11, 22, 33)
 *
 * @param inputStrings - Array of strings to calculate (e.g., ["123", "Street"])
 * @returns Calculated numerology number (1-9, 11, 22, 33)
 */
export function chaldeanNumerologyCalculator(inputStrings: string[]): number {
  const output = inputStrings?.reduce((acc: number, curr: string): number => {
    const currentString = curr.split(' '); // Split by spaces
    const currNumerology = currentString.reduce((p: number, c: string) => findNumerology(c) + p, 0);
    return findNumerology(String(acc + currNumerology));
  }, 0);

  return output;
}

/**
 * Helper to get Chaldean value for a single character
 */
export function getChaldeanValue(char: string): number {
  return CHALDEAN_MAPPING[char.toUpperCase()] || 0;
}

/**
 * Helper to get Chaldean value for a full string (without reduction)
 */
export function getChaldeanValueRaw(inputString: string): number {
  let total = 0;

  for (const char of inputString) {
    if (!isNaN(Number(char))) {
      total += Number(char);
    } else {
      total += CHALDEAN_MAPPING[char.toUpperCase()] || 0;
    }
  }

  return total;
}
