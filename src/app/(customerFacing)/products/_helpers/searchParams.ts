/**
 * Returns a new URLSearchParams object with the provided key and value.
 * @param obj - The object to create the URLSearchParams object from.
 * @param key - The key to add to the URLSearchParams object.
 * @param value - The value to add to the URLSearchParams object.
 * @returns A new URLSearchParams object with the provided key and value.
 * @example
 * // Create a new URLSearchParams object with the provided key and value
 * const obj = { key1: 'value1', key2: 'value2' };
 * const key = 'key3';
 * const value = 'value3';
 * const newSearchParams = createNewSearchParams(obj, key, value);
 * // newSearchParams.toString() = 'key1=value1&key2=value2&key3=value3'
 */
export function createNewSearchParams<T extends Record<string, unknown>>(
  obj: T,
  key: keyof T,
  value: T[keyof T]
): URLSearchParams {
  const filteredParams = returnOnlyTruthyValues(obj);

  return new URLSearchParams({
    ...filteredParams,
    [key]: value as string,
  });
}

/**
 * Returns a new URLSearchParams object with the provided key and value.
 *
 * @param obj - The object to create the URLSearchParams object from.
 * @param key - The key to add to the URLSearchParams object.
 * @param value - The value to add to the URLSearchParams object.
 * @returns A new URLSearchParams object with the provided key and value.
 */
function returnOnlyTruthyValues<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(obj).filter(([_, value]) => Boolean(value))
  ) as Partial<T>;
}
