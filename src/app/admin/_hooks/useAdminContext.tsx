import { useContext } from "react";
import { AdminContext, type ContextType } from "../_context/AdminContext";

// export function useAdminContext<Data extends object[]>() {
//   const context = useContext(AdminContext) as ContextType<Data>;

//   if (!context) {
//     throw new Error(
//       "useAdminContext must be used within a AdminContextProvider"
//     );
//   }

//   return context;
// }

type ReturnTypeOfPromise<T extends (...args: never) => Promise<unknown>> =
  NonNullable<Awaited<ReturnType<T>>>;

export function useAdminContext<
  T extends (...args: never) => Promise<unknown>,
>() {
  const context = useContext(AdminContext) as ContextType<
    ReturnTypeOfPromise<T>
  >;

  if (!context) {
    throw new Error(
      "useAdminContext must be used within a AdminContextProvider"
    );
  }

  return context;
}
