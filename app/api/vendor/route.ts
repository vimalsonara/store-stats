import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Vendor {
  mobile: string;
  userId: string;
  vendorName: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { vendorName, mobile, userId } = reqBody;

      const vendorsRef = collection(db, "vendors");

      const snapshot = await getDocs(vendorsRef);
      const vendors: Vendor[] = [];

      snapshot.docs.forEach((doc) => {
        const vendorData = doc.data();
        const currentVendor: Vendor = {
          vendorName: vendorData.vendorName,
          mobile: vendorData.mobile,
          userId: vendorData.userId,
        };
        vendors.push(currentVendor);
      });
      console.log(vendors);
      const vendorExist = vendors.find(
        (v) => v.vendorName === vendorName && v.userId === userId
      );
      if (vendorExist) {
        return NextResponse.json(
          { error: "Vendor already exists." },
          { status: 400 }
        );
      } else {
        const createdAt = serverTimestamp();
        const newVendor = await addDoc(vendorsRef, {
          vendorName,
          mobile,
          userId,
          createdAt,
        });
        return NextResponse.json({ newVendor }, { status: 201 });
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
