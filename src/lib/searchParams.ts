type SortingType = "asc" | "desc";

/**
 * Updates the URL search parameters to reflect the current sorting field and sorting type.
 *
 * @template T - The type of objects contained in the array.
 * @param {URLSearchParams} params - The URL search parameters to update.
 * @param {keyof T} currentSortField - The current field by which the data is sorted.
 * @param {keyof T} sortingField - The new field by which the data should be sorted.
 * @param {SortingType | null} currentSortingType - The current sorting order, either "asc" or "desc", or null if not set.
 * @param {SortingType} sortingType - The default sorting order to set if the sorting field changes.
 *
 * @example
 * // Setting the sorting parameters when the sorting field changes
 * const params = new URLSearchParams();
 * setSortingSearchParams(params, 'name', 'age', 'asc', 'desc');
 * // params.toString() = 'sortBy=age&sortType=desc'
 *
 * @example
 * // Toggling the sorting type when the sorting field remains the same
 * const params = new URLSearchParams('sortBy=name&sortType=asc');
 * setSortingSearchParams(params, 'name', 'name', 'asc', 'desc');
 * // params.toString() = 'sortBy=name&sortType=desc'
 *
 * @example
 * // Setting the default sorting type when the current sorting type is null
 * const params = new URLSearchParams();
 * setSortingSearchParams(params, 'name', 'name', null, 'asc');
 * // params.toString() = 'sortBy=name&sortType=asc'
 */
export function setSortingSearchParams<T>(
  params: URLSearchParams,
  currentSortField: keyof T,
  sortingField: keyof T,
  currentSortingType: SortingType | null,
  sortingType: SortingType
) {
  // Check if sortBy has changed
  if (currentSortField !== sortingField) {
    params.set("sortBy", sortingField.toString());
    params.set("sortType", sortingType);
  } else {
    // Toggle sortType if it already exists
    if (currentSortingType) {
      params.set("sortType", currentSortingType === "asc" ? "desc" : "asc");
    } else {
      // Set to default sortingType if sortType does not exist
      params.set("sortType", sortingType);
    }
  }
}
