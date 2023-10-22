import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import PurchaseEntry from "@/models/purchase";

connectDB();

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

// list purchase by vendor id
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { searchParams } = new URL(req.url);
      const vendorId = searchParams.get("id");

      const listPurchasebyVendorId = await PurchaseEntry.find({ vendorId });

      if (listPurchasebyVendorId.length > 0) {
        return NextResponse.json(listPurchasebyVendorId, { status: 200 });
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
