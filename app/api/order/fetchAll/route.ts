import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({});


    const ordersWithCartItems = await Promise.all(
      orders.map(async (order) => {
        const cartItems = await prisma.cartItem.findMany({
          where: {
            id: { in: order.cartItemIds },
          },
        });

        return {
          ...order,
          cartItems,
        };
      })
    );

    return NextResponse.json(ordersWithCartItems);
  } catch (error) {
    console.log("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
