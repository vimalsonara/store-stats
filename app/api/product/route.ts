import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Product from "@/models/product";

connectDB();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { product, userId } = reqBody;

      const productExist = await Product.findOne({ product, userId });

      if (productExist) {
        return NextResponse.json(
          { error: "Product already exists." },
          { status: 400 }
        );
      }

      const newProduct = await Product.create({
        product,
        userId,
      });

      return NextResponse.json({ newProduct }, { status: 201 });
    } catch (error) {}
  } else {
    return NextResponse.json(
      { error: "You are not authenticated." },
      { status: 401 }
    );
  }
}
