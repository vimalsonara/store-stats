import connectDB from "@/lib/db";
import Vendor from "@/models/vendor";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
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
    return NextResponse.json(vendor);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
