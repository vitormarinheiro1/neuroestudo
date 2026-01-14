import { api } from "@/lib/api";

export type StudySession = {
  id: number;
  disciplina: number;
  horas: number;
  notas?: string;
  data_inicio: string;
  data_fim: string;
  created_at?: string;
};

/**
 * Lista todas as sessões de estudo do usuário
 */
export async function listStudySessions() {
  const res = await api.get<StudySession[]>("/sessoes/");
  return res.data;
}

/**
 * Cria uma nova sessão de estudo após o cronômetro ser parado
 */
export async function createStudySession(data: {
  disciplina: number;
  horas: number;
  notas?: string;
  data_inicio: string;
  data_fim: string;
}) {
  const payload = {
    ...data,
    horas: Number((data.horas / 3600).toFixed(4)),
  };
  const res = await api.post<StudySession>("/sessoes/", payload);
  return res.data;
}

/**
 * Busca estatísticas agregadas (se sua API suportar)
 * Caso contrário, faremos o cálculo no Front-end como mostrei no Dashboard
 */
export async function getStudyStats() {
  const res = await api.get("/sessoes/stats/");
  return res.data;
}

/**
 * Remove uma sessão de estudo específica
 */
export async function deleteStudySession(id: number) {
  await api.delete(`/sessoes/${id}/`);
}
