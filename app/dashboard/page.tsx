"use client";
import { useUserStore } from "@/lib/userStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const username = useUserStore((state) => state.username);
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push("/login"); // 未登录重定向
    }
  }, [username]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">欢迎，{username}</h1>
      <p className="text-gray-600">请选择功能：</p>
      <ul className="mt-4 space-y-2 list-disc list-inside">
        <li>
          <a href="/market" className="text-blue-600">
            浏览大盘行情
          </a>
        </li>
        <li>
          <a href="/trade" className="text-blue-600">
            交易股票
          </a>
        </li>
        <li>
          <a href="/holdings" className="text-blue-600">
            查看持仓
          </a>
        </li>
        <li>
          <a href="/records" className="text-blue-600">
            查看交易记录
          </a>
        </li>
      </ul>
    </div>
  );
}
