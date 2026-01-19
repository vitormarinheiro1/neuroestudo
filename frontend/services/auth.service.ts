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

  Cookies.set("access_token", res.data.access, {
    expires: 1, // 1 dia
  });

  Cookies.set("refresh_token", res.data.refresh, {
    expires: 2, // 2 dias
  });

  Cookies.set("user", JSON.stringify(res.data.user), {
    expires: 2,
  });

  return res.data.user;
}

export async function register(data: {
  nome_completo: string;
  email: string;
  password: string;
}) {
  return api.post("/register/", data);
}

export async function logout() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user");
}