import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Product } from "@/types/types";
import db from "@/config/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { product, userId } = reqBody;

      const productExist = await db.product.findFirst({
        where: {
          product: product,
          userId: parseInt(userId),
        },
      });

      if (productExist) {
        return NextResponse.json(
          { error: "Product already exists." },
          { status: 400 }
        );
      } else {
        const newProduct = await db.product.create({
          data: {
            product: product,
            userId: parseInt(userId),
          },
        });
        return NextResponse.json(
          { message: "New Product Created." },
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
