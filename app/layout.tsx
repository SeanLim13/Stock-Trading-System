"use client";
import { useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUsername = useUserStore((state) => state.setUsername);
  const username = useUserStore((state) => state.username);

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) setUsername(saved);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <header className="flex justify-between items-center p-4 bg-gray-800">
          <h1 className="text-xl font-bold">Stock Trading System</h1>
          {username && <LogoutButton />}
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
