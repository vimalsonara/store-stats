"use client";

import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Item {
  id: string;
  itemName: string;
  quantity: number;
  price: number;
}

export type Purchase = {
  id: string;
  date: string;
  vendorName: string;
  totalAmount: number;
  items: Item[];
};

export default function ViewPurchase({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [purchase, setPurchase] = useState<Purchase>();

  useEffect(() => {
    if (params.id && session?.user) {
      const listPurchaseById = async () => {
        try {
          const purchase = await axios.get(`/api/purchase?id=${params.id}`);
          setPurchase(purchase.data);
        } catch (error: any) {
          console.log(error.message);
        }
      };
      listPurchaseById();
    }
  }, [params.id, session]);

  return (
    <div>
      <div>
        <div>
          <span className="font-bold">Date: </span>
          {purchase?.date && format(new Date(purchase?.date), "dd/MM/yyyy")}
        </div>
        <div>
          <span className="font-bold">Vendor: </span>
          {purchase?.vendorName}
        </div>
        <div>
          <span className="font-bold">Bill Amount: </span>
          {purchase?.totalAmount}
        </div>
      </div>
      <table>
        <thead>
          <tr className="border">
            <th className="border p-2">Item Name</th>
            <th className="border p-2 text-center">Quantity</th>
            <th className="border p-2 text-center">Price</th>
            <th className="border p-2 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {purchase?.items.map((item) => (
            <tr key={item.id} className="border">
              <td className="border p-2">{item.itemName}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-center">{item.price}/-</td>
              <td className="border p-2 text-center">
                {item.quantity * item.price}/-
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
