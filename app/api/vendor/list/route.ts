import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import db from "@/config/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { userId } = reqBody;

      const vendorList = await db.vendor.findMany({
        where: { userId: parseInt(userId) },
      });

      if (vendorList.length > 0) {
        return NextResponse.json(vendorList, { status: 200 });
      } else {
        return NextResponse.json({ error: "No vendor found" }, { status: 404 });
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
