"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const CartPage = () => {
  const { cart, clearCart, increaseQty, decreaseQty, getItemQuantity } = useCartStore();
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const tableNoString = localStorage.getItem("tableNo");

      if (!tableNoString) {
        alert("Enter Table Number");
        setLoading(false);
        return;
      }

      const tableNo = parseInt(tableNoString, 10);

      const currUser = await axios.post("/api/currentUser", { email: user?.email });

      const formattedCart = cart.map((item) => ({
        Itemid: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await axios.post("/api/order/create", {
        data: formattedCart,
        userId: currUser.data.id,
        tableNo: tableNo
      });

      const payment = await axios.post("/api/payment", {
        data: formattedCart,
        userId: currUser.data.id,
        email: user?.email,
        orderId: res.data.order.id
      });

      const { URL } = payment.data;

      clearCart();
      mutate("/api/order/fetchAll");
      router.push(URL);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-6 md:px-12 lg:px-24">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 text-xl mt-20">
          Your cart is currently empty. Start adding delicious items! 🍽️
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6 flex justify-between items-center border border-gray-100"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-500 text-lg">₹{item.price}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <Button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 rounded-full text-lg bg-red-500 hover:bg-red-600 text-white"
                    >
                      −
                    </Button>
                    <span className="text-xl font-bold">{getItemQuantity(item.id)}</span>
                    <Button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 rounded-full text-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-right font-bold text-2xl text-green-600">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold text-gray-800">Total: ₹{totalAmount}</h2>
              <Button
                onClick={clearCart}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-xl shadow-sm"
              >
                Clear Cart
              </Button>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold flex items-center gap-2 shadow-lg"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
