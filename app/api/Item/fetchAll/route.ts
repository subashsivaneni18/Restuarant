import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req: Request) {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
