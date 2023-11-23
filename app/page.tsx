"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboardCard";
import BarChart from "@/components/charts/barChart";
import PieChart from "@/components/charts/pieChart";

import { Purchase } from "@/types/types";
import DataTable from "@/components/dataTable";
import { columns } from "./purchase/list/columns";

export default function Home() {
  const { data: session } = useSession();
  const [vendorList, setVendorList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [lastSevenDaysPurchase, setLastSevenDaysPurchase] = useState([]);
  const [vendorSummary, setVendorSummary] = useState([]);

  useEffect(() => {
    if (session?.user.id) {
      const getVendors = async () => {
        try {
          const vendors = await axios.post("/api/vendor/list", {
            userId: session?.user.id,
          });
          if (vendors.data) {
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
            setPurchaseList(purchases.data);
          } else {
            setPurchaseList([]);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      };

      const getLastSevenDaysPurchase = async () => {
        try {
          const today = new Date();
          const todayFormatted = today.toISOString().split("T")[0];
          const lastSevenDaysData = await axios.get(
            "/api/purchase/week-summary?today=" + todayFormatted
          );
          if (lastSevenDaysData) {
            setLastSevenDaysPurchase(lastSevenDaysData.data);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      };

      const getVendorSummary = async () => {
        try {
          const vendorSummaryData = await axios.get(
            "/api/purchase/vendors-summary?userId=" + session?.user.id
          );
          if (vendorSummaryData) {
            setVendorSummary(vendorSummaryData.data);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      };
      getVendors();
      getProducts();
      getPurchases();
      getLastSevenDaysPurchase();
      getVendorSummary();
    }
  }, [session]);

  const totalPurchase = purchaseList?.reduce(
    (acc, purchase) => acc + purchase.totalAmount,
    0
  );

  return (
    <>
      <div className="flex gap-3 mt-2 flex-wrap">
        {vendorList.length > 0 && (
          <DashboardCard
            cardTitle={"Total Vendors"}
            total={vendorList.length}
          />
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
      <div className="grid md:grid-cols-12 mt-5">
        {lastSevenDaysPurchase && (
          <div className="md:col-span-8">
            <BarChart purchaseData={lastSevenDaysPurchase} />
          </div>
        )}
        {vendorSummary && (
          <div className="md:col-span-4">
            <PieChart vendorSummaryData={vendorSummary} />
          </div>
        )}
      </div>
      {purchaseList.length > 0 && (
        <DataTable columns={columns} data={purchaseList.slice(0, 10)} />
      )}
    </>
  );
}
