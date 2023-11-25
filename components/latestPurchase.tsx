import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Purchase } from "@/types/types";

interface LatestPurchaseProps {
  data: Purchase[];
}

export default function LatestPurchase({ data }: LatestPurchaseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Purchases</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>{purchase.vendorName}</TableCell>
                <TableCell>{purchase.totalAmount}</TableCell>
                <TableCell>
                  <Link href={`/purchase/${purchase.id}`}>
                    <button className="bg-blue-500 py-1 px-2 rounded-md hover:bg-blue-800">
                      View
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
