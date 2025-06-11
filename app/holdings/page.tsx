"use client";

import { useEffect, useState } from "react";
import { getInventory, getBalance, getMarketPrices } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">My Holdings</h1>
      <p className="text-gray-600 mb-4">
        Account Balance: <strong>{balance.toFixed(2)}</strong> 元
      </p>

      <table className="w-full text-sm border border-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border border-gray-700 px-2 py-1 text-left">Code</th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Amount
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Avg Cost
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">
              Current Price
            </th>
            <th className="border border-gray-700 px-2 py-1 text-left">P/L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length > 0 ? (
            holdings.map((h, idx) => {
              const current = getCurrentPrice(h.Code);
              const cost = h.AVG_Cost * h.Amount;
              const value = current ? current * h.Amount : 0;
              const profit = value - cost;
              return (
                <tr
                  key={h.Code}
                  className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="border border-gray-700 px-2 py-1">{h.Code}</td>
                  <td className="border border-gray-700 px-2 py-1">
                    {h.Amount}
                  </td>
                  <td className="border border-gray-700 px-2 py-1">
                    {h.AVG_Cost.toFixed(2)}
                  </td>
                  <td className="border border-gray-700 px-2 py-1">
                    {current?.toFixed(2) ?? "N/A"}
                  </td>
                  <td
                    className={`border border-gray-700 px-2 py-1 ${
                      profit >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {profit.toFixed(2)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-4">
                You currently hold no stocks.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
