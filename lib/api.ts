import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:12345",
  timeout: 5000,
});

export const register = async (
  username: string,
  password: string
): Promise<boolean> => {
  const res = await api.get(`/regist?username=${username}&pwd=${password}`);
  return res.data === true || res.data === "true";
};

export const login = async (
  username: string,
  password: string
): Promise<boolean> => {
  const res = await api.get(`/login?username=${username}&pwd=${password}`);
  return res.data === true || res.data === "true";
};

export const logout = async (username: string): Promise<boolean> => {
  const res = await api.get(`/logout?username=${username}`);
  return res.data === true || res.data === "true";
};

export const getMarketPrices = async () => {
  const res = await api.get("/getMarketPrice");
  return res.data;
};

export const getStockPrice = async (code: string): Promise<number[]> => {
  const res = await api.get(`/getStockPrice?code=${code}`);
  return res.data;
};

export const trade = async (
  username: string,
  code: string,
  direction: "buy" | "sell",
  price: number,
  amount: number
): Promise<number> => {
  const res = await api.get(
    `/trade?username=${username}&code=${code}&direction=${direction}&price=${price}&amount=${amount}`
  );
  return res.data;
};

export const getInventory = async (username: string) => {
  const res = await api.get(`/getInventory?username=${username}`);
  return res.data;
};

export const getBalance = async (username: string): Promise<number> => {
  const res = await api.get(`/getBalance?username=${username}`);
  const balance = parseFloat(res.data);
  return isNaN(balance) ? -1 : balance;
};

export const getTradeRecords = async (username: string) => {
  const res = await api.get(`/getTradeRecord?username=${username}`);
  return res.data;
};
