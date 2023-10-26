"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DataTable from "../../components/dataTable";
import { columns } from "./columns";
import Link from "next/link";

interface Vendor {
  _id: string;
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
  return (
    <div>
      <div>
        <ul className="flex gap-2 justify-around p-2">
          <li className="border p-2 rounded-lg">
            <Link href={"/vendor/create"}>Add Vendor</Link>
          </li>
        </ul>
      </div>
      <DataTable columns={columns} data={vendorList} />
    </div>
  );
}
