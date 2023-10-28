"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable";
import { columns } from "./columns";
import Link from "next/link";

interface Product {
  _id: string;
  product: string;
}

export default function ProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id) {
      const getAllVendorsAndProducts = async () => {
        try {
          const products = await axios.post("/api/product/list", {
            userId: session?.user.id,
          });
          setProductList(products.data);
        } catch (error) {
          console.log(error);
        }
      };

      getAllVendorsAndProducts();
    }
  }, [session]);
  console.log(productList);
  return (
    <div>
      <DataTable columns={columns} data={productList} />
    </div>
  );
}
