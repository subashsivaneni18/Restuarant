"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const SelectTablePage = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      localStorage.setItem("tableNo",input.trim())
      router.push(`/${input}/Menu`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-4"
      >
        <h1 className="text-xl font-bold text-gray-700">Enter Table Number</h1>
        <input
          type="text"
          placeholder="e.g. 12"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Menu
        </button>
      </form>
    </div>
  );
};

export default SelectTablePage;
