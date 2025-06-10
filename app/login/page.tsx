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

  // ← get the setter from your store
  const setUsername = useUserStore((s) => s.setUsername);

  const handleLogin = async () => {
    const success = await login(usernameInput, pwd);
    if (success) {
      // 1. persist to localStorage
      localStorage.setItem("username", usernameInput);
      // 2. update your global store
      setUsername(usernameInput);
      // 3. navigate
      router.push("/");
    } else {
      setMessage("Login failed — check credentials");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        className="block mb-2 p-2 border"
        placeholder="Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <input
        className="block mb-2 p-2 border"
        type="password"
        placeholder="Password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-600 text-white"
        onClick={handleLogin}
      >
        Login
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
}
