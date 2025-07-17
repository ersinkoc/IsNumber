/**
 * Options for the isNumber function
 */
export interface Options {
  /** Allow boxed numbers like new Number(5) */
  allowBoxed?: boolean;
  /** Allow coercion of numeric strings like '5', '0.5', '1e3' */
  allowCoercion?: boolean;
}

/**
 * Checks if a value is a finite number
 * 
 * @param value - The value to check
 * @param options - Optional configuration
 * @returns true if the value is a finite number
 * 
 * @example
 * ```ts
 * isNumber(5) // true
 * isNumber('5') // false
 * isNumber('5', { allowCoercion: true }) // true
 * isNumber(new Number(5)) // false
 * isNumber(new Number(5), { allowBoxed: true }) // true
 * isNumber(NaN) // false
 * isNumber(Infinity) // false
 * ```
 */
export function isNumber(value: unknown, options: Options = {}): boolean {
  const { allowBoxed = false, allowCoercion = false } = options;

  // Handle primitive numbers
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  // Handle boxed numbers
  if (allowBoxed && value instanceof Number) {
    return Number.isFinite(value.valueOf());
  }

  // Handle string coercion
  if (allowCoercion && typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return Number.isFinite(num);
  }

  return false;
}

/**
 * Strict version of isNumber (no options)
 * Only accepts primitive finite numbers
 * 
 * @param value - The value to check
 * @returns true if the value is a finite primitive number
 * 
 * @example
 * ```ts
 * isNumberStrict(5) // true
 * isNumberStrict('5') // false
 * isNumberStrict(new Number(5)) // false
 * ```
 */
export function isNumberStrict(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Loose version of isNumber (all options enabled)
 * Accepts primitive numbers, boxed numbers, and numeric strings
 * 
 * @param value - The value to check
 * @returns true if the value can be considered a finite number
 * 
 * @example
 * ```ts
 * isNumberLoose(5) // true
 * isNumberLoose('5') // true
 * isNumberLoose(new Number(5)) // true
 * isNumberLoose('abc') // false
 * ```
 */
export function isNumberLoose(value: unknown): boolean {
  return isNumber(value, { allowBoxed: true, allowCoercion: true });
}

// Default export
export default isNumber;