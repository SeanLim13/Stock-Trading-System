"use client";

import { useUserStore } from "@/lib/userStore";

export default function HomePage() {
  const username = useUserStore((s) => s.username);

  return (
    <div className="w-3xl h-full mx-auto px-4 py-6 text-center mb-6 bg-white rounded-lg ">
      <h1 className="text-4xl font-bold text-black mb-7">
        欢迎使用 StockTrader 股票交易系统
      </h1>
      <p className="text-gray-500 text-lg">
        {username
          ? `你好 ${username}！请使用上方菜单浏览系统功能。`
          : `欢迎使用本平台！请登录或注册开始交易`}
      </p>
    </div>
  );
}
