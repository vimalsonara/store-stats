"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

export type Purchase = {
  _id: string;
  date: string;
  totalAmount: number;
};

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "date",
    header: "Purchase Date",
    cell: ({ row }) => {
      const purchaseDate = format(new Date(row.original.date), "dd/MM/yyyy");

      return purchaseDate;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const purchase = row.original;

      return (
        <Link href={`/purchase/${purchase._id}`}>
          <button className="bg-blue-500 py-1 px-2 rounded-md hover:bg-blue-800">
            View
          </button>
        </Link>
      );
    },
  },
];
