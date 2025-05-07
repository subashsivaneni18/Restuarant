"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";

const Page = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    } else {
      const createUser = async () => {
        const isAlreadyPresent = await axios.post("/api/isExist", {
          email: user?.email,
        });

        if (isAlreadyPresent.data.message === "False") {
          await axios.post("/api/CreateUser", {
            name: user?.name,
            email: user?.email,
          });
        }
      };
      createUser();
    }
  }, [router, user, isLoading]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("tableNo");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  if (isLoading)
    return (
      <div className="text-center py-10 text-lg font-semibold">Loading...</div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 px-6 py-10 font-['raleway']">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-emerald-600 mb-4 animate-fade-in">
            Welcome to QuickBite 🍽️
          </h1>
          <p className="text-xl text-gray-600">
            Effortless Dining Experience — Scan, Order & Enjoy.
          </p>
        </div>

        {/* Flex container for Image and Steps */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 space-y-8 md:space-y-0 gap-5">
          {/* Food Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/images/food-banner.jpg" // Place your image in the /public folder
              alt="Delicious food spread"
              width={700}
              height={350}
              className="rounded-3xl shadow-xl object-cover"
            />
          </div>

          {/* How It Works */}
          <section className="w-full md:w-1/2 bg-white shadow-md rounded-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-emerald-700 mb-6">
              How to Order in 4 Simple Steps
            </h2>
            <ol className="list-decimal list-inside text-lg space-y-4 text-gray-700">
              <li>
                <strong>Scan the QR Code:</strong> Each table has a unique QR
                code. Scan it with your smartphone to open the menu instantly.
              </li>
              <li>
                <strong>Explore the Menu:</strong> Browse through a variety of
                delicious dishes with detailed descriptions and images.
              </li>
              <li>
                <strong>Place Your Order:</strong> Customize and confirm your
                order directly from your phone. No app required!
              </li>
              <li>
                <strong>Track Order Status:</strong> Your placed order will
                appear in the{" "}
                <span className="text-emerald-600 font-semibold">
                  Waiting List
                </span>
                . When it's ready, you’ll be notified instantly.
              </li>
            </ol>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} QuickBite. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Page;
