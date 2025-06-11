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
      <body className="bg-gray-900 text-white min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 bg-gray-800">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-2xl font-bold hover:text-gray-300">
              Stock Trading System
            </Link>
            <nav className="space-x-6">
              <Link href="/market" className="hover:text-gray-300">
                Market
              </Link>
              {!username && (
                <>
                  <Link href="/login" className="hover:text-gray-300">
                    Login
                  </Link>
                  <Link href="/register" className="hover:text-gray-300">
                    Register
                  </Link>
                </>
              )}
              {username && (
                <>
                  <Link href="/trade" className="hover:text-gray-300">
                    Trade
                  </Link>
                  <Link href="/holdings" className="hover:text-gray-300">
                    Holdings
                  </Link>
                  <Link href="/records" className="hover:text-gray-300">
                    History
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div>{username && <LogoutButton />}</div>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
