"use client";

import { useEffect, useState } from "react";
import { getTradeRecords } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";
import Link from "next/link";
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

  const fmtDir = (d: number) => (d === 0 ? "买入" : "卖出");
  const fmtState = (s: number) => {
    switch (s) {
      case 0:
        return "错误";
      case 1:
        return "待处理";
      case 2:
        return "交易成功";
      case 3:
        return "订单无效";
      case 4:
        return "余额不足";
      case 5:
        return "持仓不足";
      default:
        return "未知状态";
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg size-full">
      <h1 className="text-2xl font-bold mb-2">交易记录</h1>
      <p className="text-gray-500 mb-4">下次刷新倒计时: {countdown} 秒</p>

      <Table>
        <TableHeader className="bg-black font-medium">
          <TableRow>
            <TableHead>交易时间</TableHead>
            <TableHead>股票代码</TableHead>
            <TableHead>交易方向</TableHead>
            <TableHead>委托价格(元)</TableHead>
            <TableHead>买入数量</TableHead>
            <TableHead>成交价格(元)</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((r, idx) => (
              <TableRow key={`${r.TradeTime}-${r.Code}-${idx}`}>
                <TableCell>{r.TradeTime}</TableCell>
                <TableCell>
                  <TableCell className="text-blue-600 hover:underline">
                    <Link href={`/stock/${r.Code}`}>{r.Code}</Link>
                  </TableCell>
                </TableCell>
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
                无交易记录显示
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
