// app/api/item/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, description, Image, Ratings,Cuisine } = body;

    if (!name || !price || !description || !Image || Ratings === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.item.create({
      data: {
        name,
        price,
        description,
        Image,
        Ratings,
        Cuisine
      },
    });

    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
