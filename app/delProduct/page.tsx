"use client";
import fetcher from "@/libs/fetcher";
import React, { useCallback } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  Image: string;
  Ratings: number;
}

const Page = () => {
  const { data ,mutate} = useSWR<Item[]>("/api/Item/fetchAll", fetcher);

  const handleDelete = useCallback(async(id:string)=>{
     const res = await axios.post('/api/Item/delete',{
        id:id
     })
     console.log(res.data)
     mutate()
  },[mutate])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {data?.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex flex-col items-center"
        >
          <img
            src={item.Image}
            alt={item.name}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
          <p className="text-gray-600">₹{item.price}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="text-yellow-500">⭐ {item.Ratings}</p>
          <button
            onClick={() => handleDelete(item.id)}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Page;
