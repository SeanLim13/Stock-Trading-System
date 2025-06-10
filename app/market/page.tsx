"use client";

import { useEffect, useState } from "react";
import { getMarketPrices } from "@/lib/api";

type Stock = {
  Code: string;
  Name: string;
  Price: number;
};

export default function MarketPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [countdown, setCountdown] = useState(5);

  const fetchData = async () => {
    try {
      const data = await getMarketPrices();
      setStocks(data);
      setCountdown(5);
    } catch (error) {
      console.error("获取行情失败", error);
    }
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
  }, []);

  const categorized = {
    沪市: stocks.filter((s) => s.Code.startsWith("6")),
    深市: stocks.filter((s) => s.Code.startsWith("0")),
    创业板: stocks.filter((s) => s.Code.startsWith("3")),
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">大盘实时行情</h1>
      <p className="mb-2 text-gray-500">下次刷新倒计时：{countdown} 秒</p>

      {Object.entries(categorized).map(([title, list]) => (
        <div key={title} className="mb-6">
          <h2 className="text-xl font-semibold text-white mt-6 mb-2">
            {title}
          </h2>
          <table className="w-full text-sm border border-gray-700 mb-4">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-700 px-2 py-1 text-left">
                  Code
                </th>
                <th className="border border-gray-700 px-2 py-1 text-left">
                  Name
                </th>
                <th className="border border-gray-700 px-2 py-1 text-left">
                  Latest Price
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((stock, idx) => (
                <tr
                  key={stock.Code}
                  className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="border border-gray-700 px-2 py-1">
                    <a
                      href={`/stock/${stock.Code}`}
                      className="text-blue-500 hover:underline"
                    >
                      {stock.Code}
                    </a>
                  </td>
                  <td className="border border-gray-700 px-2 py-1">
                    {stock.Name}
                  </td>
                  <td className="border border-gray-700 px-2 py-1">
                    {stock.Price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
