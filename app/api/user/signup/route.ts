import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, email, password } = reqBody.data;

    if (!email || !password || !name) {
      return NextResponse.json("Any details can't be empty", { status: 400 });
    }

    const userExist = await db.user.findUnique({ where: { email } });

    if (!userExist) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
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
