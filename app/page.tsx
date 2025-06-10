"use client";

import Link from "next/link";
import { useUserStore } from "@/lib/userStore";

export default function HomePage() {
  const username = useUserStore((state) => state.username);

  return (
    <div className="max-w-2xl mx-auto text-center mt-20 px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to StockTrader</h1>
      <p className="mb-8 text-gray-300">
        {username
          ? `Hi ${username}, pick one of the options below to get started.`
          : `A simple stock trading system built with Next.js. Browse the market as a guest or log in to trade.`}
      </p>

      {/* Guest Links */}
      {!username && (
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </Link>
          <Link
            href="/market"
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Browse Market
          </Link>
        </div>
      )}

      {/* Authenticated User Links */}
      {username && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="block px-4 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Dashboard
          </Link>
          <Link
            href="/market"
            className="block px-4 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Market
          </Link>
          <Link
            href="/trade"
            className="block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Trade
          </Link>
          <Link
            href="/holdings"
            className="block px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Holdings
          </Link>
          <Link
            href="/records"
            className="block px-4 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 col-span-2"
          >
            Trade History
          </Link>
        </div>
      )}
    </div>
  );
}
