import type { SortingType } from "@/types/sort";

/**
 * Sorts an array of objects based on a specified field and sorting order.
 *
 * @template T - The type of objects contained in the array.
 * @param {T[]} array - The array of objects to be sorted.
 * @param {keyof T} sortingField - The field of the objects to sort by.
 * @param {SortingType} sortingType - The sorting order, either "asc" for ascending or "desc" for descending.
 * @returns {T[]} - A new array with the objects sorted based on the specified field and order.
 *
 * @example
 * // Sorting an array of objects by the 'name' field in ascending order
 * const data = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 22 },
 *   { name: 'Alice', age: 30 }
 * ];
 * const sortedByNameAsc = sortArray(data, 'name', 'asc');
 * // sortedByNameAsc = [
 * //   { name: 'Alice', age: 30 },
 * //   { name: 'Jane', age: 22 },
 * //   { name: 'John', age: 25 }
 * // ]
 *
 * @example
 * // Sorting an array of objects by the 'age' field in descending order
 * const data = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 22 },
 *   { name: 'Alice', age: 30 }
 * ];
 * const sortedByAgeDesc = sortArray(data, 'age', 'desc');
 * // sortedByAgeDesc = [
 * //   { name: 'Alice', age: 30 },
 * //   { name: 'John', age: 25 },
 * //   { name: 'Jane', age: 22 }
 * // ]
 */
export function sortArray<T>(
  array: T[],
  sortingField: keyof T,
  sortingType: SortingType
): T[] {
  return [...array].sort((a, b) => {
    if (a[sortingField] < b[sortingField]) {
      return sortingType === "asc" ? -1 : 1;
    }
    if (a[sortingField] > b[sortingField]) {
      return sortingType === "asc" ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Compares two arrays for equality. Two arrays are considered equal if they have the same length and
 * corresponding elements in both arrays are strictly equal.
 *
 * @template T - The type of elements contained in the arrays.
 * @param {T[]} a - The first array to compare.
 * @param {T[]} b - The second array to compare.
 * @returns {boolean} - Returns `true` if the arrays are equal, otherwise `false`.
 *
 * @example
 * // Comparing two arrays of numbers
 * const array1 = [1, 2, 3];
 * const array2 = [1, 2, 3];
 * const result = arraysEqual(array1, array2);
 * // result = true
 *
 * @example
 * // Comparing two arrays of strings
 * const array1 = ['a', 'b', 'c'];
 * const array2 = ['a', 'b', 'd'];
 * const result = arraysEqual(array1, array2);
 * // result = false
 *
 * @example
 * // Comparing arrays of different lengths
 * const array1 = [1, 2, 3];
 * const array2 = [1, 2, 3, 4];
 * const result = arraysEqual(array1, array2);
 * // result = false
 */
export function arraysEqual<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
