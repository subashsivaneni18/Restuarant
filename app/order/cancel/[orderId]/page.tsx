"use client";

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Loader2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CancelPage = () => {
  const params = useParams();
  const { orderId } = params as { orderId: string };

  const [status, setStatus] = useState<'loading' | 'cancelled' | 'failed'>('loading');
  const [message, setMessage] = useState('Cancelling your order...');

  useEffect(() => {
    const cancelOrder = async () => {
      try {
        await axios.post('/api/order/delete', {
          orderId: orderId
        });
        setStatus('cancelled');
        setMessage('Order cancelled successfully.');
      } catch (error) {
        setStatus('failed');
        setMessage('Something went wrong while cancelling your order.');
      }
    };

    cancelOrder();
  }, [orderId]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("tableNo");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50 text-center">
      {status === 'loading' && (
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 animate-spin text-red-500" />
          <p className="text-lg text-gray-700">{message}</p>
        </motion.div>
      )}

      {status !== 'loading' && (
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <XCircle className="w-14 h-14 text-red-600" />
          <p className="text-xl font-medium text-gray-800">{message}</p>
          <p className="text-gray-600">You may now safely close this page.</p>
        </motion.div>
      )}
    </div>
  );
};

export default CancelPage;
