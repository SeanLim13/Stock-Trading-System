"use client";

import { useEffect, useState } from "react";
import { getTradeRecords } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";

type Record = {
  Code: string;
  Amount: number;
  Direction: number; // 0 = buy, 1 = sell
  Price: number; // order price
  KnockPrice: number; // executed price
  TradeTime: string;
  State: number; // 0-5
};

export default function RecordsPage() {
  const username = useUserStore((state) => state.username);
  const [records, setRecords] = useState<Record[]>([]);
  const [countdown, setCountdown] = useState(5);

  const fetchData = async () => {
    if (!username) return;
    const data = await getTradeRecords(username);
    setRecords(Array.isArray(data) ? data : []);
    setCountdown(5);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          fetchData();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [username]);

  const formatDirection = (dir: number) => (dir === 0 ? "Buy" : "Sell");
  const formatState = (s: number) => {
    switch (s) {
      case 0:
        return "Error";
      case 1:
        return "Pending";
      case 2:
        return "Success";
      case 3:
        return "Invalid";
      case 4:
        return "Insufficient Funds";
      case 5:
        return "Insufficient Holdings";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Trade History</h1>
      <p className="text-gray-500 mb-4">Refreshing in: {countdown} seconds</p>

      <table className="w-full text-sm border border-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border border-gray-700 px-2 py-1 text-left">Time</th>
            <th className="border border-gray-700 px-2 py-1 text-left">Code</th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Direction
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Order Price
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Quantity
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Executed Price
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((r, idx) => (
              <tr
                key={r.TradeTime + r.Code + idx}
                className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="border border-gray-700 px-2 py-1">
                  {r.TradeTime}
                </td>
                <td className="border border-gray-700 px-2 py-1">{r.Code}</td>
                <td className="border border-gray-700 px-2 py-1">
                  {formatDirection(r.Direction)}
                </td>
                <td className="border border-gray-700 px-2 py-1">
                  {r.Price.toFixed(2)}
                </td>
                <td className="border border-gray-700 px-2 py-1">{r.Amount}</td>
                <td className="border border-gray-700 px-2 py-1">
                  {r.KnockPrice.toFixed(2)}
                </td>
                <td className="border border-gray-700 px-2 py-1">
                  {formatState(r.State)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-4">
                No trade history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
