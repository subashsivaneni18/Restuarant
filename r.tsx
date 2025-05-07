"use client";

import fetcher from "@/libs/fetcher";
import useSWR from "swr";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Volume2 } from "lucide-react";
import { pusherClient } from "@/libs/pusher";

interface CartItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  cartItems: CartItem[];
  userId: string;
  paymentStatus: boolean;
  completedStatus: boolean;
  TableNo: number;
  TotalValue: number;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  orderIds: string[];
}

const Page = () => {
  const { user } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    const fetchUser = async () => {
      try {
        const res = await axios.post("/api/currentUser", { email: user.email });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    fetchUser();
  }, [user]);

  const {
    data: allOrders = [],
    isLoading,
    mutate,
  } = useSWR<Order[]>(
    currentUser ? `/api/order?userId=${currentUser.id}` : null,
    fetcher
  );

  useEffect(() => {
    if (!currentUser || !soundEnabled) return;

    const channel = pusherClient.subscribe("order-updates");

    const handleStatusUpdate = (updatedOrder: Order) => {
      if (updatedOrder.userId !== currentUser.id) return;

      setNotification(`Order for Table ${updatedOrder.TableNo} is completed!`);
      setAlarmActive(true);

      mutate((prevOrders = []) => {
        const updatedOrders = prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );

        // If not found in the list, add it
        if (!updatedOrders.find((o) => o.id === updatedOrder.id)) {
          updatedOrders.push(updatedOrder);
        }

        return updatedOrders;
      }, false);

      if (alarmRef.current) {
        alarmRef.current.loop = true;
        alarmRef.current.play().catch((e) => {
          console.log("Autoplay blocked:", e);
        });
      }
    };

    channel.bind("updateOrderStatus", handleStatusUpdate);

    return () => {
      channel.unbind("updateOrderStatus", handleStatusUpdate);
      pusherClient.unsubscribe("order-updates");
    };
  }, [currentUser, soundEnabled, mutate]);

  const enableSound = () => {
    const alarm = alarmRef.current;
    if (alarm) {
      alarm
        .play()
        .then(() => {
          alarm.pause();
          alarm.currentTime = 0;
          setSoundEnabled(true);
        })
        .catch((err) => {
          console.log("Autoplay still blocked:", err);
        });
    }
  };

  const stopAlarm = () => {
    const alarm = alarmRef.current;
    if (alarm) {
      alarm.pause();
      alarm.currentTime = 0;
    }
    setNotification(null);
    setAlarmActive(false);
  };

  const activeOrders = allOrders.filter((o) => !o.completedStatus);
  const completedOrders = allOrders.filter((o) => o.completedStatus);

  const sortedActiveOrders = activeOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const sortedCompletedOrders = completedOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));
  };

  if (!hasMounted) return null;

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  }

  if (!allOrders || allOrders.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No orders found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center font-['raleway']">
        🧾 Your Orders
      </h2>

      <audio ref={alarmRef} src="/sounds/completed.mp3" preload="auto" />

      {!soundEnabled && (
        <div className="flex justify-center mb-6">
          <button
            onClick={enableSound}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 flex items-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Enable Sound Notifications
          </button>
        </div>
      )}

      {notification && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-medium shadow-sm flex justify-between items-center">
          <span>{notification}</span>
          {alarmActive && (
            <button
              onClick={stopAlarm}
              className="ml-4 text-red-600 hover:text-red-800 flex items-center"
            >
              <XCircle className="w-5 h-5 mr-1" />
              Stop Alarm
            </button>
          )}
        </div>
      )}

      {/* Preparing Orders */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-yellow-600 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Preparing Orders
        </h3>
        {sortedActiveOrders.length === 0 ? (
          <p className="text-gray-500 mb-4">No active orders.</p>
        ) : (
          sortedActiveOrders.map((order) => (
            <div
              key={order.id}
              className="mb-6 p-5 bg-yellow-50 border border-yellow-200 rounded-2xl shadow-sm"
            >
              <div className="mb-2 text-lg font-semibold">
                🍽️ Table #{order.TableNo}
              </div>
              <ul className="text-sm text-gray-700 space-y-1 mb-2">
                {order.cartItems.map((item) => (
                  <li key={item.id}>
                    <span className="font-medium">{item.name}</span> –{" "}
                    {item.quantity} × ₹{item.price} = ₹
                    {item.quantity * item.price}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-3">
                <span className="text-green-600 font-semibold">
                  Total: ₹{order.TotalValue}
                </span>
                <span className="text-yellow-700 font-semibold bg-yellow-200 px-3 py-1 rounded-full text-xs">
                  Preparing...
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Ordered on: {formatDate(order.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Orders */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Completed Orders
        </h3>
        {sortedCompletedOrders.length === 0 ? (
          <p className="text-gray-500">No completed orders yet.</p>
        ) : (
          sortedCompletedOrders.map((order) => (
            <div
              key={order.id}
              className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm"
            >
              <div className="mb-2 text-lg font-semibold">
                🍽️ Table #{order.TableNo}
              </div>
              <ul className="text-sm text-gray-700 space-y-1 mb-2">
                {order.cartItems.map((item) => (
                  <li key={item.id}>
                    <span className="font-medium">{item.name}</span> –{" "}
                    {item.quantity} × ₹{item.price} = ₹
                    {item.quantity * item.price}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-3">
                <span className="text-green-600 font-semibold">
                  Total: ₹{order.TotalValue}
                </span>
                <span className="text-blue-700 font-semibold bg-blue-200 px-3 py-1 rounded-full text-xs">
                  Completed
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Ordered on: {formatDate(order.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
