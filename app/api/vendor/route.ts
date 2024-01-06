import db from "@/config/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { vendorName, mobile, userId } = reqBody;

      const vendorExist = await db.vendor.findFirst({
        where: { vendorName: vendorName, userId: parseInt(userId) },
      });

      if (vendorExist) {
        return NextResponse.json(
          { error: "Vendor already exists." },
          { status: 400 }
        );
      } else {
        const newVendor = await db.vendor.create({
          data: {
            vendorName: vendorName,
            mobile: mobile,
            userId: parseInt(userId),
          },
        });

        return NextResponse.json(
          { messagge: "New Vendor Created." },
          { status: 201 }
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
