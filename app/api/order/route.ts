import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const userOrders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const enrichedOrders = await Promise.all(
      userOrders.map(async (order) => {
        const cartItems = await prisma.cartItem.findMany({
          where: {
            id: {
              in: order.cartItemIds,
            },
          },
        });

        return {
          ...order,
          cartItems,
        };
      })
    );

    return NextResponse.json(enrichedOrders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
