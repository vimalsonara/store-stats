"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
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
    <div className="mt-3">
      {purchase && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center">
              <div>Date</div>
              <div className="ml-auto">{purchase.date}</div>
            </div>
            <div className="flex items-center">
              <div>Vendor</div>
              <div className="ml-auto">{purchase.vendorName}</div>
            </div>
            <div className="flex items-center font-medium">
              <div>Bill Amount</div>
              <div className="ml-auto">{purchase.totalAmount}/-</div>
            </div>
          </CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Purchased Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.quantity * item.price}/-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
