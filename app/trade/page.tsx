"use client";

import { useEffect, useState } from "react";
import { trade, getMarketPrices } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type MarketPrice = {
  Code: string;
  Name: string;
  Price: number;
};

export default function TradePage() {
  const username = useUserStore((s) => s.username);
  const [code, setCode] = useState("");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"default" | "destructive">("default");

  const [market, setMarket] = useState<MarketPrice[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  // Poll market prices every 5 seconds
  useEffect(() => {
    const fetchPrices = async () => {
      const res = await getMarketPrices();
      if (Array.isArray(res)) {
        setMarket(res);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update current/previous price when code or market changes
  useEffect(() => {
    if (!code) {
      setCurrentPrice(null);
      setPreviousPrice(null);
      return;
    }
    const stock = market.find((m) => m.Code === code);
    const newPrice = stock?.Price ?? null;

    if (newPrice !== currentPrice && newPrice !== null) {
      setPreviousPrice(currentPrice);
      setCurrentPrice(newPrice);
    }
  }, [code, market]);

  const handleSubmit = async () => {
    if (!username) {
      setVariant("destructive");
      setMessage("请登录进行交易");
      return;
    }
    if (!code || !price || !amount) {
      setVariant("destructive");
      setMessage("请填写所有字段");
      return;
    }
    const priceNum = parseFloat(price);
    const amountNum = parseInt(amount, 10);
    if (amountNum % 100 !== 0) {
      setVariant("destructive");
      setMessage("股票数量需为 100 的倍数");
      return;
    }

    try {
      const status = await trade(
        username,
        code,
        direction,
        priceNum,
        amountNum
      );
      switch (status) {
        case 1:
          setVariant("default");
          setMessage("委托已提交（待成交）");
          break;
        case 2:
          setVariant("default");
          setMessage("交易已成功");
          break;
        case 3:
          setVariant("destructive");
          setMessage("委托无效：价格超出范围");
          break;
        case 4:
          setVariant("destructive");
          setMessage("余额不足，无法完成交易");
          break;
        case 5:
          setVariant("destructive");
          setMessage("持仓不足，无法完成交易");
          break;
        case 0:
          setVariant("destructive");
          setMessage("错误：无效的用户或股票代码");
          break;
        default:
          setVariant("destructive");
          setMessage("未知错误，请稍后再试");
          break;
      }
    } catch (err) {
      console.error(err);
      setVariant("destructive");
      setMessage("交易请求失败，请检查网络连接");
    }
  };

  const priceDiff =
    currentPrice !== null && previousPrice !== null
      ? currentPrice - previousPrice
      : 0;

  const renderPriceChange = () => {
    if (priceDiff > 0) {
      return <span className="text-green-500 ml-2">▲</span>;
    }
    if (priceDiff < 0) {
      return <span className="text-red-500 ml-2">▼</span>;
    }
    return null;
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg size-full">
      <h1 className="text-2xl font-bold mb-4">股票交易</h1>

      <div className="space-y-6">
        <Input
          placeholder="股票代码 (例如：601398)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {(direction === "buy" || direction === "sell") &&
          currentPrice !== null && (
            <p className="text-sm text-gray-500 flex items-center">
              最新价格:
              <strong className="ml-1">¥{currentPrice.toFixed(2)}</strong>
              {renderPriceChange()}
            </p>
          )}

        <Select
          defaultValue="buy"
          onValueChange={(val) => setDirection(val as "buy" | "sell")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Buy / Sell" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">买入</SelectItem>
            <SelectItem value="sell">卖出</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="委托价格 (例如：4.5)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          placeholder="股票数量需为 100 的倍数"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button onClick={handleSubmit} className="w-full">
          提交交易
        </Button>

        {message && (
          <Alert variant={variant} className="mt-2">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
