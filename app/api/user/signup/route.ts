import { db } from "@/lib/firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface Users {
  id: string;
  name: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, email, password } = reqBody.data;

    if (!email || !password || !name) {
      return NextResponse.json("Any details can't be empty", { status: 400 });
    }

    const userRef = collection(db, "users");
    const emailCondition = where("email", "==", email);
    const q = query(userRef, emailCondition);
    if (!email || !password || !name) {
      return NextResponse.json("Any details can't be empty", { status: 400 });
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = serverTimestamp();
      const newUser = await addDoc(userRef, {
        name,
        email,
        password: hashedPassword,
        createdAt,
      });
      return NextResponse.json("User created successfully", { status: 201 });
    } else {
      return NextResponse.json(
        { error: "User already exist" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
