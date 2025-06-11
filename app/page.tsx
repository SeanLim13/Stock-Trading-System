"use client";

import { useUserStore } from "@/lib/userStore";

export default function HomePage() {
  const username = useUserStore((s) => s.username);

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4 text-center">
      <h1 className="text-5xl font-bold text-white mb-4">
        Welcome to StockTrader
      </h1>
      <p className="text-gray-400 text-lg">
        {username
          ? `Hi ${username}, use the menu above to navigate.`
          : `A simple stock trading system built with Next.js. Please login or register to trade, or browse the market as a guest.`}
      </p>
    </div>
  );
}
