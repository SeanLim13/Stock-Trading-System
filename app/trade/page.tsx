"use client";

import { useState } from "react";
import { trade } from "@/lib/api";
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

export default function TradePage() {
  const username = useUserStore((s) => s.username);
  const [code, setCode] = useState("");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!username) {
      setMessage("Please login to trade.");
      return;
    }
    if (!code || !price || !amount) {
      setMessage("All fields are required.");
      return;
    }
    const priceNum = parseFloat(price);
    const amountNum = parseInt(amount, 10);
    if (amountNum % 100 !== 0) {
      setMessage("Amount must be a multiple of 100.");
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
          setMessage("Order placed (pending).");
          break;
        case 2:
          setMessage("Trade executed successfully.");
          break;
        case 3:
          setMessage("Invalid order: price out of range.");
          break;
        case 4:
          setMessage("Insufficient balance.");
          break;
        case 5:
          setMessage("Insufficient holdings.");
          break;
        case 0:
          setMessage("Error: invalid user or code.");
          break;
        default:
          setMessage("Unknown error.");
          break;
      }
    } catch (err) {
      console.error(err);
      setMessage("Trade request failed.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Trade</h1>

      <div className="space-y-4">
        <Input
          placeholder="Stock Code (e.g. 601398)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Select
          defaultValue="buy"
          onValueChange={(val) => setDirection(val as "buy" | "sell")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Buy / Sell" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Price (e.g. 4.5)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          placeholder="Amount (multiple of 100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button onClick={handleSubmit} className="w-full">
          Submit Trade
        </Button>

        {message && <p className="text-sm text-red-400 mt-2">{message}</p>}
      </div>
    </div>
  );
}
