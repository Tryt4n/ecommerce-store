"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getOrders } from "@/db/adminData/orders";
import { getAllProducts } from "@/db/adminData/products";
import { getUsers } from "@/db/adminData/users";
import { getDiscountCodes } from "@/db/adminData/discountCodes";
import { arraysEqual, sortArray } from "@/lib/sort";
import { setSortingSearchParams } from "@/lib/searchParams";
import { getRangeOption, RANGE_OPTIONS } from "@/lib/rangeOptions";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import type { SortingType } from "@/types/sort";
import type { DateRange } from "@/types/ranges";

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type ContextType<Data extends object[]> = {
  data: Data | undefined;
  sortData: <T extends Data[number]>(
    sortingField: NestedKeyOf<T>,
    sortingType: SortingType,
    dataToSort?: Data
  ) => void;
  refetchData: () => void;
};

export const AdminContext = createContext<ContextType<any> | null>(null);

export default function AdminContextProvider<Data extends object[]>({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<Data>();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);
  const currentSortBy = searchParams.get("sortBy") as NestedKeyOf<Data[number]>;
  const currentSortType = searchParams.get("sortType") as null | SortingType;
  const dateRange = searchParams.get("dateRange") as undefined | string;
  const dateRangeFrom = searchParams.get("dateRangeFrom") as undefined | string;
  const dateRangeTo = searchParams.get("dateRangeTo") as undefined | string;
  const searchQuery = searchParams.get("searchQuery") as undefined | string;

  const fetchData = useCallback(async () => {
    let fetchedData;
    const range =
      getRangeOption(dateRange, dateRangeFrom, dateRangeTo) ||
      RANGE_OPTIONS.all_time;
    const rangeOptions: DateRange = {
      createdAfter: range.startDate,
      createdBefore: range.endDate,
    };

    if (pathname.includes("/admin/orders")) {
      fetchedData = await getOrders("createdAt", "desc", rangeOptions).then(
        (res) => {
          if (!currentSortBy || !currentSortType || !res) return res;

          return sortArray(res, currentSortBy, currentSortType);
        }
      );
    } else if (pathname.includes("/admin/products")) {
      fetchedData = await getAllProducts("createdAt", "asc", rangeOptions).then(
        (res) => {
          if (!currentSortBy || !currentSortType || !res) return res;

          return sortArray(res, currentSortBy, currentSortType);
        }
      );
    } else if (pathname.includes("/admin/users")) {
      fetchedData = await getUsers("createdAt", "desc", rangeOptions).then(
        (res) => {
          if (!currentSortBy || !currentSortType || !res) return res;

          return sortArray(res, currentSortBy, currentSortType);
        }
      );
    } else if (pathname.includes("/admin/discount-codes")) {
      fetchedData = await getDiscountCodes(
        "createdAt",
        "desc",
        rangeOptions
      ).then((res) => {
        if (!currentSortBy || !currentSortType || !res) return res;

        const expiredDiscountCodes = sortArray(
          res.expiredDiscountCodes,
          currentSortBy,
          currentSortType
        );
        const unexpiredDiscountCodes = sortArray(
          res.unexpiredDiscountCodes,
          currentSortBy,
          currentSortType
        );

        return {
          expiredDiscountCodes: expiredDiscountCodes,
          unexpiredDiscountCodes: unexpiredDiscountCodes,
        };
      });
    }

    if (searchQuery) {
      // Define keys to check for each type of data
      const productsKeysToCheck = ["name", "categories", "priceInCents"];
      const usersKeysToCheck = ["email", "ordersValue", "ordersCount"];
      const ordersKeysToCheck = [
        "createdAt",
        "productName",
        "userEmail",
        "pricePaidInCents",
        "discountCode",
      ];
      const discountCodesKeysToCheck = [
        "code",
        "discountAmount",
        "expiresAt",
        "products",
        "categories",
      ];

      // Combine all keys to check into a single array
      const keysToCheck = [
        ...productsKeysToCheck,
        ...usersKeysToCheck,
        ...ordersKeysToCheck,
        ...discountCodesKeysToCheck,
      ];

      // Function to filter data based on search query
      const filterData = (data: Record<string, any>[]) => {
        return data.filter((item) => {
          // Extract values for each key from the item
          const values = keysToCheck.map((key) => item[key]);

          // Check if any of the values match the search query
          return values.some((value) => {
            if (typeof value === "string") {
              // Check if string value includes the search query
              return value.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (typeof value === "number") {
              // Check if number value includes the search query
              return value
                .toString()
                .includes(searchQuery.replace(",", "").toLowerCase());
            } else if (Array.isArray(value)) {
              // Check if any element in the array includes the search query
              return value.some((val) =>
                val.toLowerCase().includes(searchQuery.toLowerCase())
              );
            } else if (value instanceof Date) {
              // Define date formats to check
              const formats = [
                "dd MM yyyy",
                "dd.MM.yyyy",
                "dd.MM yyyy",
                "dd MMM yyyy",
                "dd MMMM yyyy",
                "dd MMMM yyyy",
              ];

              // Format the date in multiple formats with `date-fns`
              const formattedDates = formats.map((fmt) =>
                format(value, fmt, { locale: pl })
              );

              // Check if any of the formats contains the searchQuery
              const matches = formattedDates.some((dateStr) =>
                dateStr.includes(searchQuery)
              );

              return matches; // Returns true if any of the formats contains searchQuery
            }

            return false;
          });
        });
      };

      // Define the type for fetchedData
      type FetchedDataType =
        | Record<string, any>[]
        | {
            [key: string]: Record<string, any>[];
          };

      // Cast fetchedData to the defined type
      const data = fetchedData as FetchedDataType;

      // Check if fetchedData is an array or an object
      if (Array.isArray(data)) {
        // Filter the array using filterData function
        fetchedData = filterData(data);
      } else if (typeof data === "object" && data !== null) {
        // Iterate over keys in fetchedData if it's an object
        for (const key in data) {
          if (Array.isArray(data[key])) {
            // Filter each array in the object using filterData function
            data[key] = filterData(data[key]);
          }
        }
        fetchedData = data;
      }
    }

    setData(fetchedData as Data);
  }, [
    currentSortBy,
    currentSortType,
    dateRange,
    dateRangeFrom,
    dateRangeTo,
    pathname,
    searchQuery,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function sortData<T extends Data[number]>(
    sortingField: NestedKeyOf<T>,
    sortingType: SortingType,
    dataToSort = data
  ) {
    if (!dataToSort) return;

    // Set the sorting params
    setSortingSearchParams(
      params,
      currentSortBy as keyof Data[number],
      sortingField as keyof Data[number],
      currentSortType,
      sortingType
    );
    // Update the URL with the new sorting params
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    // Sort the orders based on the sorting field and type
    const sortedOrders = sortArray(dataToSort, sortingField, sortingType);

    // Reverse the array if it is already sorted in the same order
    if (arraysEqual(sortedOrders, dataToSort)) {
      sortedOrders.reverse();
    }

    setData(sortedOrders as Data);
  }

  const contextValue: ContextType<Data> = {
    data,
    sortData,
    refetchData: fetchData,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}
