"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";

export default function LoginPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [pwd, setPwd] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const setUsername = useUserStore((s) => s.setUsername);

  const handleLogin = async () => {
    const success = await login(usernameInput, pwd);
    if (success) {
      localStorage.setItem("username", usernameInput);
      setUsername(usernameInput);
      router.push("/");
    } else {
      setMessage("Login failed — check credentials");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">登录</h1>
      <input
        className="block mb-2 p-2 border"
        placeholder="用户名"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
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
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
}
