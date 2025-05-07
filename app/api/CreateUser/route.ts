import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name || typeof email !== "string" || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: { email, name },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
