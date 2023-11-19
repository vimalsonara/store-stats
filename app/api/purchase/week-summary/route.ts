import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Purchase } from "@/types/types";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("today");
    const purchaseRef = collection(db, "purchaseEntries");
    const purchaseList: Purchase[] = [];
    const dateArray: string[] = [];

    if (date !== null) {
      const today = new Date(date);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sevenDaysAgo);
        currentDate.setDate(sevenDaysAgo.getDate() + i);

        const formattedDate = currentDate.toISOString().split("T")[0];
        console.log(formattedDate);
        dateArray.push(formattedDate);
      }

      const snapshot = await getDocs(purchaseRef);

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
    } else {
      return NextResponse.json("Invaid date entered", { status: 400 });
    }

    if (purchaseList.length > 0) {
      const lastSeven = [];
      for (let i = 0; i < dateArray.length; i++) {
        const totalAmount = purchaseList
          .filter((purchase) => purchase.date === dateArray[i])
          .reduce((acc, currPurchase) => acc + currPurchase.totalAmount, 0);

        const purchase = {
          date: dateArray[i],
          amount: totalAmount,
        };
        lastSeven.push(purchase);
      }
      return NextResponse.json(lastSeven, { status: 200 });
    } else {
      return NextResponse.json("No purhcase found", { status: 404 });
    }
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}
