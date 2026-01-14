import { api } from "@/lib/api";

export type Review = {
  id: number;
  disciplina: number; // ID da disciplina
  topico: string;
  data_ultima: string;
  data_proxima: string;
  intervalo: number;
  facilidade: number;
  repeticoes: number;
  created_at?: string;
};

/**
 * Busca todas as revisões do usuário
 */
export async function listReviews() {
  const res = await api.get<Review[]>("/revisoes/");
  return res.data;
}

/**
 * Cria um novo tópico de revisão (Início do ciclo)
 */
export async function createReview(data: {
  disciplina: number;
  topico: string;
  data_ultima: string;
  data_proxima: string;
  intervalo: number;
  facilidade: number;
  repeticoes: number;
}) {
  const res = await api.post<Review>("/revisoes/", data);
  return res.data;
}

/**
 * Atualiza uma revisão existente após completar o ciclo SM-2
 */
export async function updateReview(id: number, data: Partial<Review>) {
  console.log(id)
  console.log(data)
  const res = await api.patch<Review>(`/revisoes/${id}/`, data);
  return res.data;
}

/**
 * Remove um tópico de revisão
 */
export async function deleteReview(id: number) {
  await api.delete(`/revisoes/${id}/`);
}
