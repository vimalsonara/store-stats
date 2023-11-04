import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  console.log(reqBody);
}
