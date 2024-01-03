import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import db from "@/config/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId !== null) {
      try {
        const vendorList = await db.vendor.findMany({
          where: { userId: parseInt(userId) },
        });

        const purchaseList = await db.purchase.findMany({
          where: { userId: parseInt(userId) },
        });

        if (vendorList.length > 0) {
          const vendorSummary = await Promise.all(
            vendorList.map(async (vendor) => {
              const currentVendorsTotal = await db.purchase.aggregate({
                where: { vendorId: vendor.id },
                _sum: { totalAmount: true },
              });

              return {
                vendorName: vendor.vendorName,
                amount: currentVendorsTotal._sum?.totalAmount || 0,
              };
            })
          );

          return NextResponse.json(vendorSummary, { status: 200 });
        } else {
          return NextResponse.json("No vendors found for the user", {
            status: 404,
          });
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
        return NextResponse.json("Internal server error", { status: 500 });
      }
    } else {
      return NextResponse.json("User can't be empty", { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}
