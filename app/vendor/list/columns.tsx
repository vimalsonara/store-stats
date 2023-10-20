"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Vendor = {
  id: string;
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
];
