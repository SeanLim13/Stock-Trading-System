"use client";
import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login(username, pwd);
    if (success) {
      setMessage("登录成功，正在跳转...");
      localStorage.setItem("username", username); // 存储用户信息
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      setMessage("登录失败，请检查用户名或密码");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">登录</h1>
      <input
        className="block mb-2 p-2 border"
        placeholder="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="block mb-2 p-2 border"
        type="password"
        placeholder="密码"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-600 text-white"
        onClick={handleLogin}
      >
        登录
      </button>
      <p className="mt-2 text-red-500">{message}</p>
    </div>
  );
}
