"use client";

import { useState } from "react";
import { trade } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";

const TradePage = () => {
  const username = useUserStore((state) => state.username);
  const [code, setCode] = useState("");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!username) {
      setMessage("You must be logged in to trade.");
      return;
    }

    if (!code || !price || !amount) {
      setMessage("Please fill in all fields.");
      return;
    }

    const priceNum = parseFloat(price);
    const amountNum = parseInt(amount);

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
          setMessage("Order placed successfully (pending execution).");
          break;
        case 2:
          setMessage("Trade executed successfully!");
          break;
        case 3:
          setMessage("Invalid order (price out of range).");
          break;
        case 4:
          setMessage("Insufficient account balance.");
          break;
        case 5:
          setMessage("Insufficient holdings.");
          break;
        default:
          setMessage("Trade failed: unknown error.");
          break;
      }
    } catch (error) {
      console.error("Trade error:", error);
      setMessage("Trade request failed.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Stock Trade</h1>
      <div className="space-y-2 max-w-md">
        <input
          className="w-full border p-2"
          placeholder="Stock Code (e.g. 601398)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <select
          className="w-full border p-2"
          value={direction}
          onChange={(e) => setDirection(e.target.value as "buy" | "sell")}
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input
          className="w-full border p-2"
          placeholder="Price (e.g. 4.5)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="w-full border p-2"
          placeholder="Amount (multiple of 100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2"
          onClick={handleSubmit}
        >
          Submit Trade
        </button>
        <p className="text-sm text-gray-700 mt-2">{message}</p>
      </div>
    </div>
  );
};

export default TradePage;
