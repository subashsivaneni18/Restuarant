import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import {pusherServer} from '@/libs/pusher'

type CartItem = {
  id: string; // needed to ensure cartStore item structure matches
  Itemid: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId;
    const tableNo = body.tableNo;

    if (!Array.isArray(body.data)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const data: CartItem[] = body.data;

    for (const item of data) {
      if (
        typeof item.Itemid !== "string" ||
        typeof item.name !== "string" ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid CartItem format" },
          { status: 400 }
        );
      }
    }

    const createdCartItems = await Promise.all(
      data.map(async (cartItem: CartItem) => {
        const newCreatedCartItem = await prisma.cartItem.create({
          data: {
            itemId: cartItem.Itemid,
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity,
          },
        });
        return newCreatedCartItem;
      })
    );

    const createdCartItemIds = createdCartItems.map((item) => item.id);

    const createdOrder = await prisma.order.create({
      data: {
        TableNo: tableNo,
        cartItemIds: createdCartItemIds,
        userId: userId,
        TotalValue: createdCartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      },
    });

    

    return NextResponse.json({ message: "Order created", order: createdOrder });
  } catch (error) {
    console.error("POST /api/order/create error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
