'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
  const [amount, setAmount] = useState<number>(0);
  
  const router = useRouter()

  const makePay = async () => {
    try {
      const res = await axios.post('/api/payment', {
        amount: Number(amount), // Ensure it's a number
      });
      const {URL} = res.data
      router.push(URL)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Make a Payment</h1>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={makePay}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
      
      </div>
    </div>
  );
};

export default Page;
