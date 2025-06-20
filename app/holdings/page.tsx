"use client";

import { useEffect, useState } from "react";
import { getInventory, getBalance, getMarketPrices } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Holding = {
  Code: string;
  Amount: number;
  Total_Cost: number;
  AVG_Cost: number;
};

type MarketPrice = {
  Code: string;
  Name: string;
  Price: number;
};

export default function HoldingsPage() {
  const username = useUserStore((state) => state.username);
  const [balance, setBalance] = useState<number>(0);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [market, setMarket] = useState<MarketPrice[]>([]);
  const [countdown, setCountdown] = useState(5);
  console.log(countdown);

  const fetchAll = async () => {
    if (!username) return;

    const [bal, inv, mkt] = await Promise.all([
      getBalance(username),
      getInventory(username),
      getMarketPrices(),
    ]);

    setBalance(bal);
    setHoldings(Array.isArray(inv) ? inv : []);
    setMarket(Array.isArray(mkt) ? mkt : []);
    setCountdown(5);
  };

  useEffect(() => {
    fetchAll();
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          fetchAll();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [username]);

  const getCurrentPrice = (code: string): number | null => {
    const stock = market.find((m) => m.Code === code);
    return stock ? stock.Price : null;
  };

  return (
    <div className="p-4 bg-white rounded-lg w-full">
      <h1 className="text-2xl font-bold mb-2">My Holdings</h1>
      <p className="text-gray-600 mb-4">
        Account Balance: <strong>{balance.toFixed(2)}</strong> 元
      </p>

      <Table>
        <TableHeader className="bg-black font-medium">
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Avg Cost</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>P / L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.length > 0 ? (
            holdings.map((h) => {
              const current = getCurrentPrice(h.Code);
              const cost = h.AVG_Cost * h.Amount;
              const value = current ? current * h.Amount : 0;
              const profit = value - cost;

              return (
                <TableRow key={h.Code}>
                  <TableCell>{h.Code}</TableCell>
                  <TableCell>{h.Amount}</TableCell>
                  <TableCell>{h.AVG_Cost.toFixed(2)}</TableCell>
                  <TableCell>{current?.toFixed(2) ?? "N/A"}</TableCell>
                  <TableCell
                    className={profit >= 0 ? "text-green-500" : "text-red-500"}
                  >
                    {profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-400 py-4">
                You currently hold no stocks.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
