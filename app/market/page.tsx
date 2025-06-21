"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMarketPrices } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Stock = {
  Code: string;
  Name: string;
  Price: number;
};

const CATEGORIES = [
  { key: "沪市", prefix: "6" },
  { key: "深市", prefix: "0" },
  { key: "创业板", prefix: "3" },
] as const;

type Category = (typeof CATEGORIES)[number]["key"];

export default function MarketPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [countdown, setCountdown] = useState(5);
  const [category, setCategory] = useState<Category>("沪市");

  const fetchData = async () => {
    try {
      const data = await getMarketPrices();
      setStocks(Array.isArray(data) ? data : []);
      setCountdown(5);
    } catch (err) {
      console.error("Failed to fetch market data", err);
      setStocks([]);
    }
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
  }, []);

  const filtered = stocks.filter((s) =>
    s.Code.startsWith(CATEGORIES.find((c) => c.key === category)!.prefix)
  );

  return (
    <div className="p-4 bg-white rounded-lg size-full">
      <h1 className="text-2xl font-bold mb-2">大盘实时行情</h1>
      <p className="text-gray-500 mb-4">下次刷新倒计时：{countdown} 秒</p>

      <div className="flex space-x-4 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`px-4 py-2 rounded ${
              category === c.key
                ? "bg-blue-600 text-white"
                : "bg-black text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setCategory(c.key)}
          >
            {c.key}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader className="bg-black font-medium">
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>最新价格</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length > 0 ? (
            filtered.map((stock) => (
              <TableRow key={stock.Code}>
                <TableCell>
                  <Link
                    href={`/stock/${stock.Code}`}
                    className="text-blue-500 hover:underline"
                  >
                    {stock.Code}
                  </Link>
                </TableCell>
                <TableCell>{stock.Name}</TableCell>
                <TableCell>{stock.Price.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                该板块暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
