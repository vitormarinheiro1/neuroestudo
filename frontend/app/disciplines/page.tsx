"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, BookOpen, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";

// Importando o service de disciplinas
import {
  listDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
  type Discipline,
} from "@/services/disciplines.service"; // Ajuste o caminho conforme seu projeto
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f97316",
  "#6366f1",
];

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(
    null
  );

  const [formData, setFormData] = useState({
    nome: "",
    cor: COLORS[0],
    meta_semanal: 10,
  });

  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadDisciplines = async () => {
    try {
      setLoading(true);
      const data = await listDisciplines();
      setDisciplines(data);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDiscipline) {
        await updateDiscipline(editingDiscipline.id, formData);
      } else {
        await createDiscipline(formData);
      }

      await loadDisciplines();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
      alert("Erro ao salvar. Verifique a conexão com a API.");
    }
  };

  const handleEdit = (discipline: Discipline) => {
    setEditingDiscipline(discipline);
    setFormData({
      nome: discipline.nome,
      cor: discipline.cor,
      meta_semanal: discipline.meta_semanal,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta disciplina?")) {
      try {
        await deleteDiscipline(id);
        setDisciplines(disciplines.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const resetForm = () => {
    setEditingDiscipline(null);
    setFormData({
      nome: "",
      cor: COLORS[0],
      meta_semanal: 10,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Minhas Disciplinas
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie todas as matérias do seu edital
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2 h-11 text-base shadow-lg shadow-primary/25">
                <Plus className="w-5 h-5" />
                Nova Disciplina
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingDiscipline ? "Editar" : "Nova"} Disciplina
                </DialogTitle>
                <DialogDescription className="text-base">
                  {editingDiscipline
                    ? "Edite os dados da disciplina"
                    : "Adicione uma nova disciplina ao seu plano de estudos"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-3">
                  <Label htmlFor="nome" className="text-base font-semibold">
                    Nome da Disciplina
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Direito Constitucional"
                    className="h-11"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="meta" className="text-base font-semibold">
                    Meta Semanal (horas)
                  </Label>
                  <Input
                    id="meta"
                    type="number"
                    min="1"
                    className="h-11"
                    value={formData.meta_semanal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_semanal: Number.parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Cor</Label>
                  <div className="grid grid-cols-8 gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-10 h-10 rounded-xl border-2 transition-all"
                        style={{
                          backgroundColor: color,
                          borderColor:
                            formData.cor === color ? "#000" : "transparent",
                          transform:
                            formData.cor === color ? "scale(1.1)" : "scale(1)",
                        }}
                        onClick={() => setFormData({ ...formData, cor: color })}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 h-11 text-base">
                    {editingDiscipline
                      ? "Salvar Alterações"
                      : "Adicionar Disciplina"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : disciplines.length === 0 ? (
          <Card className="border-2">
            {/* ... Conteúdo de lista vazia permanece igual ... */}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((discipline) => (
              <Card
                key={discipline.id}
                className="border-2 hover:shadow-xl transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: discipline.cor + "20" }}
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: discipline.cor }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {discipline.nome}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          Meta: {discipline.meta_semanal}h/semana
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(discipline)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(discipline.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">
                        Progresso Semanal
                      </span>
                      <span className="font-bold">
                        0h / {discipline.meta_semanal}h
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ backgroundColor: discipline.cor, width: "0%" }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
