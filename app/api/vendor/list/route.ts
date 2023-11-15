import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Vendor } from "@/types/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const reqBody = await req.json();
      const { userId } = reqBody;

      const vendorsRef = collection(db, "vendors");
      const q = query(vendorsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const vendorList: Vendor[] = [];
        querySnapshot.forEach((doc) => {
          const vendorData = doc.data();
          const vendor: Vendor = {
            id: doc.id,
            vendorName: vendorData.vendorName,
            userId: vendorData.userId,
            mobile: vendorData.mobile,
          };
          vendorList.push(vendor);
        });
        return NextResponse.json(vendorList, { status: 200 });
      } else {
        return NextResponse.json({ error: "No vendor found" }, { status: 404 });
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
