"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to StockTrader</h1>
      <p className="mb-8 text-gray-300">
        A simple stock trading system built with Next.js. Login or register to
        start trading!
      </p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
