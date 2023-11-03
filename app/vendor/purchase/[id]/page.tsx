"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import DataTable from "@/components/dataTable";

export type Purchase = {
  id: string;
  date: string;
  totalAmount: number;
};

export default function VendorPurchaseList({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);

  useEffect(() => {
    if (params.id && session?.user) {
      const listPurchaseById = async () => {
        try {
          const purchases = await axios.get(
            `/api/purchase/list?id=${params.id}`
          );
          setPurchaseList(purchases.data);
        } catch (error: any) {
          console.log(error.message);
        }
      };
      listPurchaseById();
    }
  }, [params.id, session]);
  console.log(purchaseList);
  return (
    <div>
      <DataTable columns={columns} data={purchaseList} />
    </div>
  );
}
