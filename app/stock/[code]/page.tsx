"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStockPrice } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function StockChartPage() {
  const { code } = useParams() as { code: string };
  const [prices, setPrices] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(5);

  const fetchData = async () => {
    if (!code) return;
    try {
      const data = await getStockPrice(code);
      setPrices(Array.isArray(data) ? data : []);
      setCountdown(5);
    } catch {
      setPrices([]);
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
  }, [code]);

  const MAX_POINTS = 100;
  const fullData = prices.map((p, i) => ({ name: i + 1, price: p }));
  const chartData =
    fullData.length > MAX_POINTS
      ? fullData.slice(fullData.length - MAX_POINTS)
      : fullData;

  return (
    <div className="p-4 bg-white rounded-md size-full">
      <h1 className="text-xl font-bold mb-2">股票代码: {code}</h1>
      <p className="text-gray-400 mb-4">下次刷新倒计时: {countdown} 秒</p>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#ccc", fontSize: 12 }}
              axisLine={{ stroke: "#555" }}
              interval="preserveStartEnd"
              tickCount={6}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#ccc", fontSize: 12 }}
              axisLine={{ stroke: "#555" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#2563eb" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              name="价格"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">暂无历史价格数据</p>
      )}
    </div>
  );
}
