"use client";

import React from "react";
import useProductsContext from "../_hooks/useProductsContext";
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
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductsTable() {
  const { products } = useProductsContext();

  if (!products) {
    return <LoadingSpinner size={64} aria-label="Loading products ..." />;
  }

  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHeadSortingButton title="Name" sortingField="name" />
          <TableHeadSortingButton
            title="Price"
            className="text-center"
            sortingField="priceInCents"
          />
          <TableHeadSortingButton
            title="Orders"
            className="text-center"
            sortingField="_count"
            sortingType="desc"
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
              {product.name}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {formatCurrency(product.priceInCents / 100)}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {formatNumber(product._count)}
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
