"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit, BookOpen } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { getDisciplines, saveDiscipline, deleteDiscipline, type Discipline } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f97316", "#6366f1"]

export default function DisciplinesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: COLORS[0],
    goal: 10,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadDisciplines(currentUser.id)
  }, [router])

  const loadDisciplines = (userId: string) => {
    const data = getDisciplines(userId)
    setDisciplines(data)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const discipline: Discipline = {
      id: editingDiscipline?.id || Date.now().toString(),
      userId: user.id,
      name: formData.name,
      color: formData.color,
      goal: formData.goal,
      createdAt: editingDiscipline?.createdAt || new Date().toISOString(),
    }

    saveDiscipline(discipline)
    loadDisciplines(user.id)
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (discipline: Discipline) => {
    setEditingDiscipline(discipline)
    setFormData({
      name: discipline.name,
      color: discipline.color,
      goal: discipline.goal,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (disciplineId: string) => {
    if (!user) return
    if (confirm("Tem certeza que deseja excluir esta disciplina?")) {
      deleteDiscipline(user.id, disciplineId)
      loadDisciplines(user.id)
    }
  }

  const resetForm = () => {
    setEditingDiscipline(null)
    setFormData({
      name: "",
      color: COLORS[0],
      goal: 10,
    })
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Minhas Disciplinas</h1>
            <p className="text-lg text-muted-foreground">Gerencie todas as matérias do seu edital</p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
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
                <DialogTitle className="text-2xl">{editingDiscipline ? "Editar" : "Nova"} Disciplina</DialogTitle>
                <DialogDescription className="text-base">
                  {editingDiscipline
                    ? "Edite os dados da disciplina"
                    : "Adicione uma nova disciplina ao seu plano de estudos"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-semibold">
                    Nome da Disciplina
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Direito Constitucional"
                    className="h-11"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="goal" className="text-base font-semibold">
                    Meta Semanal (horas)
                  </Label>
                  <Input
                    id="goal"
                    type="number"
                    min="1"
                    max="100"
                    className="h-11"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: Number.parseInt(e.target.value) })}
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
                        className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: formData.color === color ? "#000" : "transparent",
                          transform: formData.color === color ? "scale(1.15)" : "scale(1)",
                        }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 h-11 text-base">
                    {editingDiscipline ? "Salvar Alterações" : "Adicionar Disciplina"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 text-base border-2 bg-transparent"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {disciplines.length === 0 ? (
          <Card className="border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-2xl">Nenhuma disciplina cadastrada</h3>
                  <p className="text-muted-foreground text-base">
                    Comece adicionando as matérias do seu edital para organizar seus estudos
                  </p>
                </div>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="gap-2 h-11 text-base shadow-lg shadow-primary/25"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Primeira Disciplina
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((discipline) => (
              <Card key={discipline.id} className="border-2 hover:shadow-xl transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: discipline.color + "20" }}
                      >
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: discipline.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{discipline.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">Meta: {discipline.goal}h/semana</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-primary/10"
                        onClick={() => handleEdit(discipline)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
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
                      <span className="text-muted-foreground font-medium">Progresso Semanal</span>
                      <span className="font-bold">0h / {discipline.goal}h</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ backgroundColor: discipline.color, width: "0%" }}
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
  )
}
