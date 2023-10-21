import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Purchase from "@/models/purchase";

connectDB();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { userId } = reqBody;

      const purchaseList = await Purchase.find({ userId });

      if (purchaseList.length > 0) {
        return NextResponse.json(purchaseList, { status: 200 });
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
