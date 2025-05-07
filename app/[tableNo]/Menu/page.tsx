"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useCartStore } from "@/store/cartStore";
import { Loader2, Star, Search } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  Image: string;
  Ratings: number;
  Cuisine: string;
}

const Page = () => {
  const [menuItems, setMenuItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useUser();

  const tableNo = params.tableNo as string;
  const {
    addToCart,
    increaseQty,
    decreaseQty,
    getItemQuantity,
    cart,
    setTableNo,
  } = useCartStore();

  useEffect(() => {
    localStorage.setItem("tableNo", tableNo);

    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const res = await axios.get("/api/Item/fetchAll");
        setMenuItems(res.data);
        setFilteredItems(res.data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [tableNo, setTableNo]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("tableNo");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useMemo(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    let items = [...menuItems];

    if (searchTerm) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine !== "all") {
      items = items.filter((item) => item.Cuisine === selectedCuisine);
    }

    if (sortOrder === "asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      items.sort((a, b) => b.price - a.price);
    }

    setFilteredItems(items);
  }, [searchTerm, selectedCuisine, sortOrder, menuItems]);

  if (isLoading || loadingItems)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-white to-gray-200">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        <span className="ml-4 text-gray-700 text-xl font-semibold">
          Preparing your delicious menu...
        </span>
      </div>
    );

  if (!user) return null;

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cuisineTypes = [
    "all",
    ...Array.from(new Set(menuItems.map((item) => item.Cuisine))),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 pb-28">
      {/* Header Section */}
      <div className="py-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight font-['raleway']">
          Welcome to Our Fine Dining
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose your favorites and enjoy a luxurious experience at Table #
          {tableNo}
        </p>
      </div>

      {/* Filters Section */}
      <div className="max-w-6xl mx-auto px-4 mb-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
        </div>

        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "none" | "asc" | "desc")
          }
          className="border rounded-lg p-2 w-full"
        >
          <option value="none">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>

        <Button
          onClick={() => {
            setSearchTerm("");
            setSelectedCuisine("all");
            setSortOrder("none");
          }}
          variant="outline"
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={item.Image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-gray-700 mt-auto">
                  <p className="text-green-600 font-bold text-xl">
                    ₹{item.price}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 h-5 w-5 fill-yellow-400" />
                    <span className="font-semibold">{item.Ratings}/5</span>
                  </div>
                </div>

                {quantity > 0 ? (
                  <div className="flex items-center justify-center mt-5">
                    <div className="flex items-center bg-gray-100 rounded-full shadow-inner px-4 py-2 gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => decreaseQty(item.id)}
                        className="text-red-600 hover:bg-red-100 rounded-full w-8 h-8 p-0"
                        size="icon"
                      >
                        −
                      </Button>
                      <span className="text-lg font-semibold text-gray-800 min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => increaseQty(item.id)}
                        className="text-green-600 hover:bg-green-100 rounded-full w-8 h-8 p-0"
                        size="icon"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(item)}
                    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-xl font-semibold shadow"
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      {totalCartItems > 0 && (
        <div
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 bg-opacity-90 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-xl text-lg font-bold hover:bg-blue-700 transition-all duration-300 cursor-pointer z-50"
          onClick={() => router.push(`/cart`)}
        >
          View Cart ({totalCartItems})
        </div>
      )}
    </div>
  );
};

export default Page;
