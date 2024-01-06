"use client";

import ChartCard from "@/components/chartCard";
import BarChart from "@/components/charts/barChart";
import PieChart from "@/components/charts/pieChart";
import DashboardCard from "@/components/dashboardCard";
import LatestPurchase from "@/components/latestPurchase";
import { Purchase } from "@/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Users, Layers, ShoppingCart, IndianRupee } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const [vendorList, setVendorList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [lastSevenDaysPurchase, setLastSevenDaysPurchase] = useState([]);
  const [vendorSummary, setVendorSummary] = useState([]);

  useEffect(() => {
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

    const fetchData = async () => {
      try {
        await Promise.all([
          getVendors(),
          getProducts(),
          getPurchases(),
          getLastSevenDaysPurchase(),
          getVendorSummary(),
        ]);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    if (session?.user.id) {
      fetchData();
    }
  }, [session]);

  const totalPurchase = purchaseList?.reduce(
    (acc, purchase) => acc + purchase.totalAmount,
    0
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mt-3">
        {vendorList.length > 0 && (
          <DashboardCard
            cardTitle={"Total Vendors"}
            total={vendorList.length}
            icon={<Users />}
          />
        )}
        {productList.length > 0 && (
          <DashboardCard
            cardTitle={"Total Products"}
            total={productList.length}
            icon={<Layers />}
          />
        )}
        {purchaseList.length > 0 && (
          <>
            <DashboardCard
              cardTitle={"Total Purchase"}
              total={purchaseList.length}
              icon={<ShoppingCart />}
            />
            <DashboardCard
              cardTitle={"Total Purchase Amount"}
              total={totalPurchase}
              icon={<IndianRupee />}
            />
          </>
        )}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {lastSevenDaysPurchase && (
          <ChartCard heading="Last 7 days" className="lg:col-span-2">
            <BarChart purchaseData={lastSevenDaysPurchase} />
          </ChartCard>
        )}
        {vendorSummary && (
          <ChartCard heading="Vendor Summary" className="lg:col-span-1">
            <PieChart vendorSummaryData={vendorSummary} />
          </ChartCard>
        )}
      </div>
      {purchaseList.length > 0 && (
        <LatestPurchase data={purchaseList.slice(0, 10)} />
      )}
    </div>
  );
}
