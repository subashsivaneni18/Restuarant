// /app/api/paymentStatus/route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { status: "failed", message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { status: "failed", message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === true) {
      // Payment was already marked successful, no need to update again
      return NextResponse.json({
        status: "success",
        message: "Payment already confirmed",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: true },
    });

    return NextResponse.json({
      status: "success",
      message: "Payment status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error in paymentStatus route:", error);
    return NextResponse.json(
      { status: "failed", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
