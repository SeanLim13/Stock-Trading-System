"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/userStore";
import LogoutButton from "@/components/LogoutButton";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUsername = useUserStore((s) => s.setUsername);
  const username = useUserStore((s) => s.username);

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) {
      setUsername(saved);
    }
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen text-gray-800 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-200 relative overflow-hidden flex flex-col">
        {/* Blurred Background Blobs */}
        <div className="absolute top-[-150px] left-[-100px] w-[300px] h-[300px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[300px] h-[300px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75 z-0"></div>

        {/* Header */}
        <header className="relative z-10 px-6 py-4 bg-white/80 shadow-md rounded-b-xl flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold hover:text-gray-700">
              StockTrader
            </Link>
          </div>

          {/* Center: Navigation (absolute center) */}
          <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-8 text-lg">
            <Link href="/market" className="hover:text-gray-700">
              大盘行情
            </Link>
            {!username && (
              <>
                <Link href="/login" className="hover:text-gray-700">
                  登录
                </Link>
                <Link href="/register" className="hover:text-gray-700">
                  注册
                </Link>
              </>
            )}
            {username && (
              <>
                <Link href="/trade" className="hover:text-gray-700">
                  交易股票
                </Link>
                <Link href="/holdings" className="hover:text-gray-700">
                  查看持仓
                </Link>
                <Link href="/records" className="hover:text-gray-700">
                  交易记录
                </Link>
              </>
            )}
          </nav>

          {/* Right: Logout Button */}
          <div className="flex-shrink-0">{username && <LogoutButton />}</div>
        </header>

        {/* Main Content Centered */}
        <main className="relative z-10 flex-grow flex items-center justify-center p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
