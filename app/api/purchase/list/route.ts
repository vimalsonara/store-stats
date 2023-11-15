import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Purchase } from "@/types/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { userId } = reqBody;

      const purchaseRef = collection(db, "purchaseEntries");
      const snapshot = await getDocs(purchaseRef);
      const purchaseList: Purchase[] = [];

      snapshot.docs.forEach((doc) => {
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

      const currentUsersPurchase = purchaseList.filter(
        (purchase) => purchase.userId === userId
      );

      if (currentUsersPurchase.length > 0) {
        return NextResponse.json(currentUsersPurchase, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "No purchase found" },
          { status: 404 }
        );
      }
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}

// list purchase by vendor id
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { searchParams } = new URL(req.url);
      const vendorId = searchParams.get("id");

      const purchaseRef = collection(db, "purchaseEntries");
      const snapshot = await getDocs(purchaseRef);
      const purchaseList: Purchase[] = [];

      snapshot.docs.forEach((doc) => {
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

      const currentVendorPurchases = purchaseList.filter(
        (purchase) => purchase.vendorId === vendorId
      );

      if (currentVendorPurchases.length > 0) {
        return NextResponse.json(currentVendorPurchases, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "No purchase found" },
          { status: 404 }
        );
      }
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}
