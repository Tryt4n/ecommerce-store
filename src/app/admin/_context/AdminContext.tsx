"use client";

import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getOrders } from "@/db/adminData/orders";
import { getAllProducts } from "@/db/adminData/products";
import { getUsers } from "@/db/userData/user";
import { arraysEqual, sortArray } from "@/lib/sort";
import { setSortingSearchParams } from "@/lib/searchParams";
import type { SortingType } from "@/types/sort";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type ContextType<Data extends object[]> = {
  data: Data | undefined;
  sortData: (
    sortingField: NestedKeyOf<Data[number]>,
    sortingType: SortingType,
    dataToSort?: Data
  ) => void;
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

  useEffect(() => {
    async function fetchData() {
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
      }

      setData(fetchedData as Data);
    }

    fetchData();
  }, [currentSortBy, currentSortType, pathname]);

  function sortData(
    sortingField: NestedKeyOf<Data[number]>,
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
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}
