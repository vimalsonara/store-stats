import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Purchase } from "@/types/types";
import db from "@/config/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { userId } = reqBody;

      const currentUsersPurchase = await db.purchase.findMany({
        where: { userId: parseInt(userId) },
      });

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

      if (!vendorId) {
        return NextResponse.json(
          { error: "No vendor id provided" },
          { status: 400 }
        );
      }

      const currentVendorPurchases = await db.purchase.findMany({
        where: { vendorId: parseInt(vendorId) },
      });

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
