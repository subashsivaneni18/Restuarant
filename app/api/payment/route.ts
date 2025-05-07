import { NextResponse } from "next/server";
import Stripe from "stripe";

type CartItem = {
  id: string;
  Itemid: string;
  name: string;
  price: number;
  quantity: number;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, userId, email,orderId } = body;

    if (!Array.isArray(data) || typeof email !== "string") {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    const cartItems: CartItem[] = data;

    // Validate cart items
    for (const item of cartItems) {
      if (
        typeof item.name !== "string" ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return NextResponse.json(
          { message: "Invalid cart item format" },
          { status: 400 }
        );
      }
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // in paisa
      },
      quantity: item.quantity,
    }));

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      success_url: `${process.env.NEXT_BASE_URL}/order/success/${orderId}`,
      cancel_url: `${process.env.NEXT_BASE_URL}/order/cancel/${orderId}`,
      metadata: {
        userId,
      },
    });

    console.log(orderId)

    return NextResponse.json({ URL: session.url });
  } catch (error) {
    console.error("POST /api/payment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
