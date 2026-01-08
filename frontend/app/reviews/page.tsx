"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, CheckCircle2, CalendarIcon, Brain } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { getDisciplines, getReviews, saveReview, type Review, type Discipline } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// SuperMemo SM-2 Algorithm
function calculateNextReview(
  review: Review,
  quality: number,
): { interval: number; easeFactor: number; repetitions: number } {
  let { interval, easeFactor, repetitions } = review

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  return { interval, easeFactor, repetitions }
}

export default function ReviewsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [pendingReviews, setPendingReviews] = useState<Review[]>([])
  const [upcomingReviews, setUpcomingReviews] = useState<Review[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    disciplineId: "",
    topic: "",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    const disciplinesData = getDisciplines(currentUser.id)
    setDisciplines(disciplinesData)
    loadReviews(currentUser.id)
  }, [router])

  const loadReviews = (userId: string) => {
    const data = getReviews(userId)
    setReviews(data)

    const now = new Date()
    const pending = data.filter((r) => new Date(r.nextReview) <= now)
    const upcoming = data
      .filter((r) => new Date(r.nextReview) > now)
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())

    setPendingReviews(pending)
    setUpcomingReviews(upcoming)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const review: Review = {
      id: Date.now().toString(),
      userId: user.id,
      disciplineId: formData.disciplineId,
      topic: formData.topic,
      lastReview: now.toISOString(),
      nextReview: tomorrow.toISOString(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    }

    saveReview(review)
    loadReviews(user.id)
    setIsDialogOpen(false)
    setFormData({ disciplineId: "", topic: "" })
  }

  const handleReviewComplete = (review: Review, quality: number) => {
    if (!user) return

    const { interval, easeFactor, repetitions } = calculateNextReview(review, quality)
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + interval)

    const updatedReview: Review = {
      ...review,
      lastReview: new Date().toISOString(),
      nextReview: nextReviewDate.toISOString(),
      interval,
      easeFactor,
      repetitions,
    }

    saveReview(updatedReview)
    loadReviews(user.id)
  }

  const getDisciplineName = (disciplineId: string) => {
    return disciplines.find((d) => d.id === disciplineId)?.name || "Disciplina"
  }

  const getDisciplineColor = (disciplineId: string) => {
    return disciplines.find((d) => d.id === disciplineId)?.color || "#3b82f6"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Hoje"
    if (date.toDateString() === tomorrow.toDateString()) return "Amanhã"

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Revisões Inteligentes</h1>
            <p className="text-lg text-muted-foreground">Baseado na Curva do Esquecimento de Ebbinghaus</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-11 text-base shadow-lg shadow-primary/25">
                <Plus className="w-5 h-5" />
                Novo Tópico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">Novo Tópico para Revisão</DialogTitle>
                <DialogDescription className="text-base">
                  Adicione um tópico que deseja revisar periodicamente
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-3">
                  <Label htmlFor="discipline" className="text-base font-semibold">
                    Disciplina
                  </Label>
                  <Select
                    value={formData.disciplineId}
                    onValueChange={(value) => setFormData({ ...formData, disciplineId: value })}
                  >
                    <SelectTrigger id="discipline" className="h-11">
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline.id} value={discipline.id}>
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: discipline.color }} />
                            <span className="font-medium">{discipline.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-base font-semibold">
                    Tópico
                  </Label>
                  <Input
                    id="topic"
                    placeholder="Ex: Princípios Constitucionais"
                    className="h-11"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 h-11 text-base">
                    Adicionar Tópico
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

        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Revisões Pendentes</h2>
            <div className="grid grid-cols-1 gap-6">
              {pendingReviews.map((review) => (
                <Card
                  key={review.id}
                  className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-2 h-16 rounded-full"
                          style={{ backgroundColor: getDisciplineColor(review.disciplineId) }}
                        />
                        <div>
                          <CardTitle className="text-2xl mb-1">{review.topic}</CardTitle>
                          <CardDescription className="text-base">
                            {getDisciplineName(review.disciplineId)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-primary">Revisar Agora</div>
                        <div className="text-sm text-muted-foreground">Repetição #{review.repetitions + 1}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-base font-medium text-muted-foreground">Como foi a revisão?</p>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { label: "Difícil", quality: 1 },
                          { label: "Ruim", quality: 2 },
                          { label: "Ok", quality: 3 },
                          { label: "Bom", quality: 4 },
                          { label: "Fácil", quality: 5 },
                        ].map((option) => (
                          <Button
                            key={option.quality}
                            size="lg"
                            variant="outline"
                            className="bg-background border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                            onClick={() => handleReviewComplete(review, option.quality)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Reviews */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Próximas Revisões</h2>
          {upcomingReviews.length === 0 && pendingReviews.length === 0 ? (
            <Card className="border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center space-y-6 max-w-md">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-2xl">Nenhuma revisão agendada</h3>
                    <p className="text-muted-foreground text-base">
                      Adicione tópicos para começar a revisar com o método científico
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 h-11 text-base shadow-lg shadow-primary/25"
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar Primeiro Tópico
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingReviews.map((review) => (
                <Card key={review.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className="w-2 h-14 rounded-full"
                        style={{ backgroundColor: getDisciplineColor(review.disciplineId) }}
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{review.topic}</CardTitle>
                        <CardDescription className="text-sm">{getDisciplineName(review.disciplineId)}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-5 h-5" />
                        <span className="font-medium">{formatDate(review.nextReview)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <span className="text-muted-foreground font-medium">{review.repetitions}x</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              Como Funciona o Sistema de Revisões?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-base text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold text-xl">•</span>
                <span>
                  <strong className="text-foreground">Baseado no algoritmo SuperMemo SM-2</strong> - Otimiza seus
                  intervalos de revisão
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold text-xl">•</span>
                <span>
                  <strong className="text-foreground">Espaçamento crescente</strong> - Quanto melhor você avaliar, maior
                  o intervalo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold text-xl">•</span>
                <span>
                  <strong className="text-foreground">Reforço inteligente</strong> - Tópicos difíceis aparecem com mais
                  frequência
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold text-xl">•</span>
                <span>
                  <strong className="text-foreground">Maximiza retenção</strong> - Revise no momento ideal para
                  memorização de longo prazo
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
