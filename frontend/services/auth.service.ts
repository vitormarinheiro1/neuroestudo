import Cookies from "js-cookie";
import { api } from "@/lib/api";

type LoginResponse = {
  access: string;
  refresh: string;
  user: {
    id: number;
    nome_completo: string;
    email: string;
  };
};

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/login/", {
    email,
    password,
  });

  // salva tokens
  Cookies.set("access_token", res.data.access);
  Cookies.set("refresh_token", res.data.refresh);
  Cookies.set("user", JSON.stringify(res.data.user));

  return res.data.user;
}

export async function register(data: {
  nome_completo: string;
  email: string;
  password: string;
}) {
  return api.post("/register/", data);
}
