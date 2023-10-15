import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Vendor from "@/models/vendor";

connectDB();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { vendorName, mobile, userId } = reqBody;

      const vendorExist = await Vendor.findOne({ mobile });

      if (vendorExist) {
        return NextResponse.json(
          { error: "Vendor already exists." },
          { status: 400 }
        );
      }

      const vendor = await Vendor.create({
        vendorName,
        mobile,
        userId,
      });
      return NextResponse.json({ vendor }, { status: 201 });
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
