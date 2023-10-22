"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ViewPurchase({ params }: { params: { id: string } }) {
  const { data: session } = useSession();

  const [purchaseList, setPurchaseList] = useState();
  useEffect(() => {
    if (params.id && session?.user) {
      const listPurchaseById = async () => {
        try {
          const purchases = await axios.get(`/api/purchase?id=${params.id}`);
          setPurchaseList(purchases.data);
        } catch (error: any) {
          console.log(error.message);
        }
      };
      listPurchaseById();
    }
  }, [params.id, session]);
  console.log(purchaseList);
  return <div>Purchase By Vendor</div>;
}
