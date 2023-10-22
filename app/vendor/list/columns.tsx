"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type Vendor = {
  _id: string;
  vendorName: string;
  mobile: string;
};

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "vendorName",
    header: "Vendor Name",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vendor = row.original;

      return (
        <Link href={`/purchase/${vendor._id}`}>
          <button className="bg-blue-500 py-1 px-2 rounded-md hover:bg-blue-800">
            View
          </button>
        </Link>
      );
    },
  },
];
