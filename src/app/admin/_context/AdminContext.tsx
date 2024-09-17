"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getOrders } from "@/db/adminData/orders";
import { getAllProducts } from "@/db/adminData/products";
import { getUsers } from "@/db/userData/user";
import { getDiscountCodes } from "@/db/adminData/discountCodes";
import { arraysEqual, sortArray } from "@/lib/sort";
import { setSortingSearchParams } from "@/lib/searchParams";
import type { SortingType } from "@/types/sort";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const fetchData = useCallback(async () => {
    let fetchedData;

    if (pathname.includes("/admin/orders")) {
      fetchedData = await getOrders("createdAt").then((res) => {
        if (!currentSortBy || !currentSortType || !res) return res;

        return sortArray(res, currentSortBy, currentSortType);
      });
    } else if (pathname.includes("/admin/products")) {
      fetchedData = await getAllProducts("createdAt").then((res) => {
        if (!currentSortBy || !currentSortType || !res) return res;

        return sortArray(res, currentSortBy, currentSortType);
      });
    } else if (pathname.includes("/admin/users")) {
      fetchedData = await getUsers("createdAt").then((res) => {
        if (!currentSortBy || !currentSortType || !res) return res;

        return sortArray(res, currentSortBy, currentSortType);
      });
    } else if (pathname.includes("/admin/discount-codes")) {
      fetchedData = await getDiscountCodes("createdAt").then((res) => {
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

    setData(fetchedData as Data);
  }, [currentSortBy, currentSortType, pathname]);

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
