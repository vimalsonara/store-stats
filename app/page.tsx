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
      const getVendors = async () => {
        try {
          const vendors = await axios.post("/api/vendor/list", {
            userId: session?.user.id,
          });
          if (vendors.data) {
            console.log(vendors);
            setVendorList(vendors.data);
          } else {
            setVendorList([]);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      };
      const getProducts = async () => {
        try {
          const products = await axios.post("/api/product/list", {
            userId: session?.user.id,
          });
          if (products.data) {
            console.log(products);
            setProductList(products.data);
          } else {
            setProductList([]);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      };
      const getPurchases = async () => {
        try {
          const purchases = await axios.post("/api/purchase/list", {
            userId: session?.user.id,
          });

          if (purchases.data) {
            console.log(purchases);
            setPurchaseList(purchases.data);
          } else {
            setPurchaseList([]);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      };
      getVendors();
      getProducts();
      getPurchases();
    }
  }, [session]);

  const totalPurchase = purchaseList?.reduce(
    (acc, purchase) => acc + purchase.totalAmount,
    0
  );

  return (
    <div className="flex gap-3 mt-2 flex-wrap">
      {vendorList.length > 0 && (
        <DashboardCard cardTitle={"Total Vendors"} total={vendorList.length} />
      )}
      {productList.length > 0 && (
        <DashboardCard
          cardTitle={"Total Products"}
          total={productList.length}
        />
      )}
      {purchaseList.length > 0 && (
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
