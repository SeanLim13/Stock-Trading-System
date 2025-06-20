"use client";

import { useUserStore } from "@/lib/userStore";

export default function HomePage() {
  const username = useUserStore((s) => s.username);

  return (
    <div className="w-3xl h-full mx-auto px-4 py-6 text-center mb-6 bg-white rounded-lg ">
      <h1 className="text-5xl font-bold text-black mb-7">
        Welcome to StockTrader
      </h1>
      <p className="text-gray-500 text-lg">
        {username
          ? `Hi ${username}, use the menu above to navigate.`
          : `A simple stock trading system built with Next.js. Please login or register to trade, or browse the market as a guest.`}
      </p>
    </div>
  );
}
