"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { useUserStore } from "@/lib/userStore";

export default function LogoutButton() {
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  const clearUser = useUserStore((state) => state.logout);

  const handleLogout = async () => {
    if (!username) {
      router.push("/login");
      return;
    }

    try {
      const ok = await logout(username);
      if (ok) {
        clearUser();
        router.push("/login");
      } else {
        alert("注销失败-请重试");
      }
    } catch (err) {
      console.error(err);
      alert("注销失败");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      注销
    </button>
  );
}
