"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardCard from "@/app/components/dashboardCard";

interface Purchase {
  totalAmount: number;
}

export default function Home() {
  const { data: session } = useSession();
  const [vendorList, setVendorList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);

  useEffect(() => {
    if (session?.user.id) {
      const getVendorProductPurchase = async () => {
        try {
          const vendors = await axios.post("/api/vendor/list", {
            userId: session?.user.id,
          });
          const products = await axios.post("/api/product/list", {
            userId: session?.user.id,
          });
          const purchases = await axios.post("/api/purchase/list", {
            userId: session?.user.id,
          });
          setVendorList(vendors.data);
          setProductList(products.data);
          setPurchaseList(purchases.data);
        } catch (error: any) {
          console.log(error.message);
        }
      };
      getVendorProductPurchase();
    }
  }, [session]);

  const totalPurchase = purchaseList?.reduce(
    (acc, purchase) => acc + purchase.totalAmount,
    0
  );

  return (
    <div className="flex gap-3 mt-2 flex-wrap">
      {vendorList && (
        <DashboardCard cardTitle={"Total Vendors"} total={vendorList.length} />
      )}
      {productList && (
        <DashboardCard
          cardTitle={"Total Products"}
          total={productList.length}
        />
      )}
      {purchaseList && (
        <>
          <DashboardCard
            cardTitle={"Total Purchase"}
            total={purchaseList.length}
          />
          <DashboardCard
            cardTitle={"Total Purchase Amount"}
            total={totalPurchase}
          />
        </>
      )}
    </div>
  );
}
