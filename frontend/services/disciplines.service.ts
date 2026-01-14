import { api } from "@/lib/api";

export type Discipline = {
  id: number;
  nome: string;
  cor: string;
  meta_semanal: number;
};

export async function listDisciplines() {
  const res = await api.get<Discipline[]>("/disciplinas/");
  return res.data;
}

export async function createDiscipline(data: {
  nome: string;
  cor: string;
  meta_semanal: number;
}) {
  const res = await api.post<Discipline>("/disciplinas/", data);
  return res.data;
}

export async function updateDiscipline(
  id: number,
  data: {
    nome: string;
    cor: string;
    meta_semanal: number;
  }
) {
  const res = await api.put<Discipline>(`/disciplinas/${id}/`, data);
  return res.data;
}

export async function deleteDiscipline(id: number) {
  await api.delete(`/disciplinas/${id}/`);
}
