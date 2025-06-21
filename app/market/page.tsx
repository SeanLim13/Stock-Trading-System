"use client";

import { useEffect, useState } from "react";
import { getMarketPrices, getStockPrice } from "@/lib/api";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type MarketData = {
  Code: string;
  Name: string;
  Price: number;
  Change?: number;
  ChangePct?: number;
};

export default function MarketPage() {
  const [market, setMarket] = useState<MarketData[]>([]);
  const [countdown, setCountdown] = useState(5);
  const [selectedTab, setSelectedTab] = useState<"hu" | "shen" | "chuang">(
    "hu"
  );

  const fetchMarket = async () => {
    const prices = await getMarketPrices();
    if (Array.isArray(prices)) {
      const withChange = await Promise.all(
        prices.map(async (stock) => {
          const history = await getStockPrice(stock.Code);
          const open = history?.[0];
          const curr = stock.Price;
          let change = null;
          let changePct = null;
          if (typeof open === "number") {
            change = curr - open;
            changePct = (change / open) * 100;
          }
          return {
            ...stock,
            Change: change,
            ChangePct: changePct,
          };
        })
      );
      setMarket(withChange);
    }
    setCountdown(5);
  };

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          fetchMarket();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMarket = market.filter((stock) => {
    if (selectedTab === "hu") return stock.Code.startsWith("6");
    if (selectedTab === "shen") return stock.Code.startsWith("0");
    if (selectedTab === "chuang") return stock.Code.startsWith("3");
    return false;
  });

  return (
    <div className="p-4 bg-white rounded-lg size-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">大盘实时行情</h1>
      <p className="text-gray-500 mb-4">下次刷新倒计时: {countdown} 秒</p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <Button
          variant={selectedTab === "hu" ? "default" : "outline"}
          onClick={() => setSelectedTab("hu")}
        >
          沪市
        </Button>
        <Button
          variant={selectedTab === "shen" ? "default" : "outline"}
          onClick={() => setSelectedTab("shen")}
        >
          深市
        </Button>
        <Button
          variant={selectedTab === "chuang" ? "default" : "outline"}
          onClick={() => setSelectedTab("chuang")}
        >
          创业板
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-black text-white">
            <TableRow>
              <TableHead>股票代码</TableHead>
              <TableHead>股票名称</TableHead>
              <TableHead>最新价格</TableHead>
              <TableHead>当日涨跌价</TableHead>
              <TableHead>当日涨跌幅</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarket.map((stock) => (
              <TableRow key={stock.Code}>
                <TableCell>{stock.Code}</TableCell>
                <TableCell>{stock.Name}</TableCell>
                <TableCell>{stock.Price.toFixed(2)}</TableCell>
                <TableCell
                  className={
                    stock.Change != null
                      ? stock.Change > 0
                        ? "text-green-600"
                        : stock.Change < 0
                        ? "text-red-600"
                        : ""
                      : "text-gray-400"
                  }
                >
                  {stock.Change != null ? stock.Change.toFixed(2) : "N/A"}
                </TableCell>
                <TableCell
                  className={
                    stock.ChangePct != null
                      ? stock.ChangePct > 0
                        ? "text-green-600"
                        : stock.ChangePct < 0
                        ? "text-red-600"
                        : ""
                      : "text-gray-400"
                  }
                >
                  {stock.ChangePct != null
                    ? `${stock.ChangePct.toFixed(2)}%`
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
