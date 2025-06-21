"use client";

import { useEffect, useState } from "react";
import { getTradeRecords } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Record = {
  Code: string;
  Amount: number;
  Direction: number;
  Price: number;
  KnockPrice: number;
  TradeTime: string;
  State: number;
};

export default function RecordsPage() {
  const username = useUserStore((s) => s.username);
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
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          fetchData();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [username]);

  const fmtDir = (d: number) => (d === 0 ? "Buy" : "Sell");
  const fmtState = (s: number) => {
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
    <div className="p-4 bg-white rounded-lg size-full">
      <h1 className="text-2xl font-bold mb-2">Trade History</h1>
      <p className="text-gray-500 mb-4">Refreshing in: {countdown} seconds</p>

      <Table>
        <TableHeader className="bg-black font-medium">
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Order Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Executed Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((r, idx) => (
              <TableRow key={`${r.TradeTime}-${r.Code}-${idx}`}>
                <TableCell>{r.TradeTime}</TableCell>
                <TableCell>{r.Code}</TableCell>
                <TableCell>{fmtDir(r.Direction)}</TableCell>
                <TableCell>{r.Price.toFixed(2)}</TableCell>
                <TableCell>{r.Amount}</TableCell>
                <TableCell>{r.KnockPrice.toFixed(2)}</TableCell>
                <TableCell>{fmtState(r.State)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400 py-4">
                No trade history available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
