"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DataTable from "../../components/dataTable";
import { columns } from "./columns";
import Link from "next/link";

export type Purchase = {
  _id: string;
  date: string;
  totalAmount: number;
};

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
      <div>
        <ul className="flex gap-2 justify-around p-2">
          <li>
            <Link href={"/purchase/add"}>New Purchase</Link>
          </li>
        </ul>
      </div>
      <DataTable columns={columns} data={purchaseList} />
    </div>
  );
}
