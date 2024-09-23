"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableHeadSortingButton from "../../_components/TableHeadSortingButton";
import ProductDropdownMenu from "./ProductDropdownMenu";
import TextWithSearchOption from "@/components/TextWithSearchOption";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { getAllProducts } from "@/db/adminData/products";

export default function ProductsTable() {
  const { data: products, sortData: sortProducts } =
    useAdminContext<typeof getAllProducts>();

  if (!products) {
    return <LoadingSpinner size={64} aria-label="Loading products..." />;
  }

  if (products.length === 0) {
    return <p className="text-center">No products found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHeadSortingButton
            title="Name"
            sortingFn={() => sortProducts("name", "asc")}
          />
          <TableHeadSortingButton
            title="Price"
            className="text-center"
            sortingFn={() => sortProducts("priceInCents", "asc")}
          />
          <TableHead className="text-center">Categories</TableHead>
          <TableHeadSortingButton
            title="Orders"
            className="text-center"
            sortingFn={() => sortProducts("_count", "desc")}
          />
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="text-xl">
              {product.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <span aria-label="Product is available">✅</span>
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <span aria-label="Product is unavailable">❌</span>
                </>
              )}
            </TableCell>

            <TableCell align="left" className="text-nowrap">
              <TextWithSearchOption text={product.name} />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption
                text={formatCurrency(product.priceInCents / 100)}
              />
            </TableCell>

            <TableCell align="center" className="w-full text-nowrap capitalize">
              {product.categories.join(", ")}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption text={formatNumber(product._count)} />
            </TableCell>

            <TableCell
              title="More Actions"
              align="right"
              className="text-nowrap"
            >
              <ProductDropdownMenu product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
