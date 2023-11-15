import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Product } from "@/types/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { userId } = reqBody;

      const productsRef = collection(db, "products");
      const q = query(productsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const productList: Product[] = [];
        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          const product: Product = {
            id: doc.id,
            product: productData.product,
            userId: productData.userId,
          };
          productList.push(product);
        });
        return NextResponse.json(productList, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "No product found" },
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
