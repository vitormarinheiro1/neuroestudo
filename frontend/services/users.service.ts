import { api } from "@/lib/api";

// export async function getProfile() {
//   const response = await api.get("/usuarios/me/");
//   return response.data;
// }

export async function updateProfile(
  id: number,
  data: { nome_completo: string; email: string }
) {
  const response = await api.patch(`/usuarios/${id}/`, data);
  return response.data;
}

export async function changePassword(data: any) {
  const response = await api.post("/usuarios/change-password/", data);
  return response.data;
}
