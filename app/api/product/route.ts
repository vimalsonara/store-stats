import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Product } from "@/types/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { product, userId } = reqBody;
      const productsRef = collection(db, "products");

      const snapshot = await getDocs(productsRef);
      const products: Product[] = [];

      snapshot.docs.forEach((doc) => {
        const productData = doc.data();
        const currentProduct: Product = {
          product: productData.product,
          userId: productData.userId,
          id: productData.id,
        };
        products.push(currentProduct);
      });

      const productExist = products.find(
        (p) => p.product === product && p.userId === userId
      );
      if (productExist) {
        return NextResponse.json(
          { error: "Product already exists." },
          { status: 400 }
        );
      } else {
        const createdAt = serverTimestamp();
        const newProduct = await addDoc(productsRef, {
          product: product,
          userId: userId,
          createdAt,
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
