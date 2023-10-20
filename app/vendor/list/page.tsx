"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "./dataTable";
import { columns } from "./columns";

interface Vendor {
  id: string;
  vendorName: string;
  mobile: string;
}

export default function VendorList() {
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id) {
      const getAllVendorsAndProducts = async () => {
        try {
          const vendors = await axios.post("/api/vendor/list", {
            userId: session?.user.id,
          });
          setVendorList(vendors.data);
        } catch (error) {
          console.log(error);
        }
      };

      getAllVendorsAndProducts();
    }
  }, [session]);
  console.log(vendorList);
  return <DataTable columns={columns} data={vendorList} />;
}