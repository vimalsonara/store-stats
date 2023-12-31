import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Purchase } from "@/types/types";
import db from "@/config/db";

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

      // Convert string values to numbers for each item
      const convertedItems = items.map((item: any) => ({
        itemName: item.itemName,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        productId: parseInt(item.productId),
      }));

      await db.purchase.create({
        data: {
          date: date,
          userId: parseInt(userId),
          vendorId: parseInt(vendorId),
          vendorName: vendorName,
          totalAmount: parseFloat(totalAmount),
          items: { create: convertedItems },
        },
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

      if (!purchaseId) {
        return NextResponse.json(
          { error: "Purchase id is required." },
          { status: 400 }
        );
      }

      const purchase = await db.purchase.findUnique({
        where: { id: parseInt(purchaseId) },
        include: { items: true },
      });

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
