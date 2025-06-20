"use client";
import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (pwd !== confirmPwd) {
      setMessage("密码不一致");
      return;
    }

    const success = await register(username, pwd);
    if (success) {
      setMessage("注册成功，跳转中...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage("注册失败，用户名可能已存在");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">注册</h1>
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
      <input
        className="block mb-2 p-2 border"
        type="password"
        placeholder="确认密码"
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white"
        onClick={handleSubmit}
      >
        注册
      </button>
      <p className="mt-2 text-red-500">{message}</p>
    </div>
  );
}
