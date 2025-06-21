"use client";

import { useEffect, useState } from "react";
import { getInventory, getBalance, getMarketPrices } from "@/lib/api";
import Link from "next/link";
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
      <h1 className="text-2xl font-bold mb-2">账户持仓</h1>
      <p className="text-gray-600 mb-4">
        账户余额: <strong>{balance.toFixed(2)}</strong> 元
      </p>

      <Table>
        <TableHeader className="bg-black font-medium">
          <TableRow>
            <TableHead>股票代码</TableHead>
            <TableHead>买入数量</TableHead>
            <TableHead>买入价格（元）</TableHead>
            <TableHead>实时价格（元）</TableHead>
            <TableHead>盈亏金额（元）</TableHead>
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
                  <TableCell className="text-blue-600 hover:underline">
                    <Link href={`/stock/${h.Code}`}>{h.Code}</Link>
                  </TableCell>
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
                暂无股票
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
