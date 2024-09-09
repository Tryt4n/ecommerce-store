import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/db/adminData";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import ProductDropdownMenu from "./ProductDropdownMenu";

export default async function ProductsTable() {
  const products = await getProducts();

  if (!products) {
    return <p>Loading products...</p>;
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
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
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

            <TableCell>{product.name}</TableCell>

            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>

            <TableCell>{formatNumber(product._count.orders)}</TableCell>

            <TableCell title="More Actions">
              <ProductDropdownMenu product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
