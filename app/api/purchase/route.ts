import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import PurchaseEntry from "@/models/purchase";

connectDB();

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

      const newPurchaseEntry = await PurchaseEntry.create({
        date,
        userId,
        vendorId,
        vendorName,
        totalAmount,
        items,
      });
      return NextResponse.json({ newPurchaseEntry }, { status: 201 });
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
