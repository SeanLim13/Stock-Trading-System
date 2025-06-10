import { create } from "zustand";

interface UserStore {
  username: string | null;
  setUsername: (name: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: null,
  setUsername: (name) => set({ username: name }),
  logout: () => {
    localStorage.removeItem("username");
    set({ username: null });
  },
}));
