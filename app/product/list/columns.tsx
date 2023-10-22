"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type Product = {
  _id: string;
  product: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product",
    header: "Product Name",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Link href={`/product/`}>
          <button className="bg-blue-500 py-1 px-2 rounded-md hover:bg-blue-800">
            View
          </button>
        </Link>
      );
    },
  },
];
