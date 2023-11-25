"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable";
import { columns } from "./columns";
import { Purchase } from "@/types/types";

export default function PurchaseList() {
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id) {
      const getAllPurchase = async () => {
        try {
          const purchases = await axios.post("/api/purchase/list", {
            userId: session?.user.id,
          });
          setPurchaseList(purchases.data);
        } catch (error) {
          console.log(error);
        }
      };

      getAllPurchase();
    }
  }, [session]);
  console.log(purchaseList);
  return (
    <div>
      <DataTable columns={columns} data={purchaseList} />
    </div>
  );
}
