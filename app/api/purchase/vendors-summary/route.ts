import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Purchase, Vendor } from "@/types/types";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId !== null) {
      const vendorsRef = collection(db, "vendors");
      const vendorQuery = query(vendorsRef, where("userId", "==", userId));
      const vendorQuerySnapshot = await getDocs(vendorQuery);
      const vendorList: Vendor[] = [];

      const purchaseRef = collection(db, "purchaseEntries");
      const purchaseQuery = query(purchaseRef, where("userId", "==", userId));
      const purchaseQuerysnapshot = await getDocs(purchaseQuery);
      const purchaseList: Purchase[] = [];

      vendorQuerySnapshot.forEach((doc) => {
        const vendorData = doc.data();
        const vendor: Vendor = {
          id: doc.id,
          vendorName: vendorData.vendorName,
          userId: vendorData.userId,
          mobile: vendorData.mobile,
        };
        vendorList.push(vendor);
      });

      purchaseQuerysnapshot.docs.forEach((doc) => {
        const purchaseData = doc.data();
        const currentPurchase: Purchase = {
          id: doc.id,
          date: purchaseData.date,
          totalAmount: purchaseData.totalAmount,
          userId: purchaseData.userId,
          vendorId: purchaseData.vendorId,
          vendorName: purchaseData.vendorName,
          items: purchaseData.items,
        };
        purchaseList.push(currentPurchase);
      });

      if (vendorList.length > 0) {
        const vendorSummary = [];

        for (let i = 0; i < vendorList.length; i++) {
          const currentVendorsTotal = purchaseList
            .filter((purchase) => purchase.vendorId === vendorList[i].id)
            .reduce((acc, currPurchase) => acc + currPurchase.totalAmount, 0);

          const total = {
            vendorName: vendorList[i].vendorName,
            amount: currentVendorsTotal,
          };
          vendorSummary.push(total);
        }

        return NextResponse.json(vendorSummary, { status: 200 });
      }
    } else {
      return NextResponse.json("User can't be empty", { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}
