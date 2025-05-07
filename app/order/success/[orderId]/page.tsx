"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const OrderStatusPage = () => {
  const params = useParams();
  const { orderId } = params as { orderId: string };

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const res = await axios.post("/api/paymentStatus", {
          orderId: orderId,
        });
        if (res.data.status === "success") {
          setStatus("success");
          setMessage("Payment successful. Thank you for your order!");
        } else {
          setStatus("failed");
          setMessage("Payment failed or not found.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("Something went wrong while checking payment status.");
      }
    };

    checkPaymentStatus();
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
      {status === "loading" && (
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-700">
            Checking your payment status...
          </p>
        </motion.div>
      )}

      {status !== "loading" && (
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {status === "success" ? (
            <CheckCircle className="w-14 h-14 text-green-500" />
          ) : (
            <XCircle className="w-14 h-14 text-red-500" />
          )}
          <p className="text-xl font-medium">{message}</p>
          <p className="text-gray-600">You may now safely close this page.</p>
        </motion.div>
      )}
    </div>
  );
};

export default OrderStatusPage;
