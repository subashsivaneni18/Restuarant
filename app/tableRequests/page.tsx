"use client";
import fetcher from "@/libs/fetcher";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { pusherClient } from "@/libs/pusher";

interface TableRequest {
  id: string;
  TableNumber: number;
  userId: string;
  completedStatus: boolean;
}

const Page = () => {
  const { data, isLoading, mutate } = useSWR<TableRequest[]>(
    "/api/TableCall",
    fetcher
  );
  const previousRequestCount = useRef<number>(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      previousRequestCount.current = data.length;
    }

    const handleNotification = () => {
      const audio = new Audio("/sounds/ding.mp3");
      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
      mutate();
    };

    pusherClient.subscribe("adminTableRequests");
    pusherClient.bind("newRequestAppeared", handleNotification);

    return () => {
      pusherClient.unsubscribe("adminTableRequests");
      pusherClient.unbind("newRequestAppeared", handleNotification);
    };
  }, [mutate, data]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await fetch(`/api/TableCall/delete?id=${id}`, {
        method: "DELETE",
      });
      setLoading(false);
      mutate();
    } catch (error) {
      console.error("Failed to delete request", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Table Requests
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-[50vh] text-gray-600">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          <span className="ml-4 text-lg">Loading table requests...</span>
        </div>
      ) : data?.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-10">
          No table requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.map((request) => (
            <div
              key={request.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Table #{request.TableNumber}
              </h2>

              {request.completedStatus ? (
                <p className="text-green-600 font-semibold text-sm">
                  Completed
                </p>
              ) : (
                <>
                  <p className="text-red-500 font-semibold text-sm mb-2">
                    Pending
                  </p>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                  >
                    {loading ? (
                      <div className="flex gap-2">
                        <Loader2 className="animate-spin h-5 w-5 text-white" />
                        "Deleting"
                      </div>
                    ) : (
                      "Remove Request"
                    )}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
