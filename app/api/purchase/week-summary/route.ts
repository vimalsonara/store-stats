import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("today");

    if (date !== null) {
      try {
        const today = new Date(date);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        const dateArray: string[] = [];

        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(sevenDaysAgo);
          currentDate.setDate(sevenDaysAgo.getDate() + i);

          const formattedDate = currentDate.toISOString().split("T")[0];
          dateArray.push(formattedDate);
        }

        const lastSeven = await Promise.all(
          dateArray.map(async (currentDate) => {
            const totalAmount = await prisma.purchase.aggregate({
              where: { date: currentDate },
              _sum: { totalAmount: true },
            });

            return {
              date: currentDate,
              amount: totalAmount._sum.totalAmount || 0,
            };
          })
        );

        return NextResponse.json(lastSeven, { status: 200 });
      } catch (error) {
        console.error("Error retrieving data:", error);
        return NextResponse.json("Internal server error", { status: 500 });
      }
    } else {
      return NextResponse.json("Invalid date entered", { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}
