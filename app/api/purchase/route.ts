import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Purchase } from "@/types/types";

// add new purchase
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();

      const { date, userId, vendorId, vendorName, totalAmount, items } =
        reqBody;

      if (
        !date ||
        !userId ||
        !vendorId ||
        !vendorName ||
        !totalAmount ||
        !items
      ) {
        return NextResponse.json(
          { error: "Any details can't be empty." },
          { status: 400 }
        );
      }

      const purchaseRef = collection(db, "purchaseEntries");
      const newPurchase = await addDoc(purchaseRef, {
        date,
        userId,
        vendorId,
        vendorName,
        totalAmount,
        items,
      });

      return NextResponse.json(
        { message: "New Purchase Added." },
        { status: 201 }
      );
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

// get purchase by id
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { searchParams } = new URL(req.url);
      const purchaseId = searchParams.get("id");

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

      const purchase = purchaseList.find(
        (purchaseItem) => purchaseItem.id === purchaseId
      );

      if (purchase) {
        return NextResponse.json(purchase, { status: 200 });
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
