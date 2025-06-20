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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TradePage() {
  const username = useUserStore((s) => s.username);
  const [code, setCode] = useState("");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"default" | "destructive">("default");

  const handleSubmit = async () => {
    if (!username) {
      setVariant("destructive");
      setMessage("Please login to trade.");
      return;
    }
    if (!code || !price || !amount) {
      setVariant("destructive");
      setMessage("All fields are required.");
      return;
    }
    const priceNum = parseFloat(price);
    const amountNum = parseInt(amount, 10);
    if (amountNum % 100 !== 0) {
      setVariant("destructive");
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
          setVariant("default");
          setMessage("Order placed (pending).");
          break;
        case 2:
          setVariant("default");
          setMessage("Trade executed successfully.");
          break;
        case 3:
          setVariant("destructive");
          setMessage("Invalid order: price out of range.");
          break;
        case 4:
          setVariant("destructive");
          setMessage("Insufficient balance.");
          break;
        case 5:
          setVariant("destructive");
          setMessage("Insufficient holdings.");
          break;
        case 0:
          setVariant("destructive");
          setMessage("Error: invalid user or code.");
          break;
        default:
          setVariant("destructive");
          setMessage("Unknown error.");
          break;
      }
    } catch (err) {
      console.error(err);
      setVariant("destructive");
      setMessage("Trade request failed.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg size-full">
      <h1 className="text-2xl font-bold mb-4">Stock Trade</h1>

      <div className="space-y-6">
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

        {message && (
          <Alert variant={variant} className="mt-2">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
