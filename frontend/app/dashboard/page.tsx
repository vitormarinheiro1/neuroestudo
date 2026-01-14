"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Book, Target, Play, Calendar, Flame } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { getStudySessions, getDisciplines, getReviews } from "@/lib/storage"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalHoursToday: 0,
    totalHoursWeek: 0,
    totalHoursMonth: 0,
    totalDisciplines: 0,
    reviewsToday: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      // router.push("/login")
      return
    }
    setUser(currentUser)

    // Calculate stats
    const sessions = getStudySessions(currentUser.id)
    const disciplines = getDisciplines(currentUser.id)
    const reviews = getReviews(currentUser.id)

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalHoursToday =
      sessions.filter((s) => new Date(s.startTime) >= today).reduce((sum, s) => sum + (s.duration || 0), 0) / 3600

    const totalHoursWeek =
      sessions.filter((s) => new Date(s.startTime) >= weekAgo).reduce((sum, s) => sum + (s.duration || 0), 0) / 3600

    const totalHoursMonth =
      sessions.filter((s) => new Date(s.startTime) >= monthAgo).reduce((sum, s) => sum + (s.duration || 0), 0) / 3600

    const reviewsToday = reviews.filter((r) => {
      const reviewDate = new Date(r.nextReview)
      return reviewDate <= now && reviewDate >= today
    }).length

    // Calculate streak
    let streak = 0
    const checkDate = new Date(today)
    while (true) {
      const dayStart = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      const hasSession = sessions.some((s) => {
        const sessionDate = new Date(s.startTime)
        return sessionDate >= dayStart && sessionDate < dayEnd
      })
      if (hasSession) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    setStats({
      totalHoursToday: Math.round(totalHoursToday * 10) / 10,
      totalHoursWeek: Math.round(totalHoursWeek * 10) / 10,
      totalHoursMonth: Math.round(totalHoursMonth * 10) / 10,
      totalDisciplines: disciplines.length,
      reviewsToday,
      currentStreak: streak,
    })
  }, [router])

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Olá, {user.name.split(" ")[0]}!</h1>
          <p className="text-lg text-muted-foreground">Aqui está seu resumo de hoje</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Hoje
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalHoursToday}h</div>
              <p className="text-sm text-muted-foreground mt-1">Horas de estudo</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Semana
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.totalHoursWeek}h</div>
              <p className="text-sm text-muted-foreground mt-1">Total semanal</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Disciplinas
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Book className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalDisciplines}</div>
              <p className="text-sm text-muted-foreground mt-1">Ativas</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Sequência
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.currentStreak}</div>
              <p className="text-sm text-muted-foreground mt-1">Dias consecutivos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-xl hover:shadow-primary/10 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground" />
                </div>
                Iniciar Sessão de Estudo
              </CardTitle>
              <CardDescription className="text-base">Comece uma nova sessão com cronômetro inteligente</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full h-12 text-base shadow-lg shadow-primary/25"
                onClick={() => router.push("/study")}
              >
                Iniciar Agora
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                Revisões Pendentes
              </CardTitle>
              <CardDescription className="text-base">
                {stats.reviewsToday > 0
                  ? `Você tem ${stats.reviewsToday} revisões para hoje`
                  : "Nenhuma revisão pendente hoje"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full h-12 text-base border-2 bg-transparent"
                onClick={() => router.push("/reviews")}
                disabled={stats.reviewsToday === 0}
              >
                {stats.reviewsToday > 0 ? "Ver Revisões" : "Sem Revisões"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Progresso do Mês</CardTitle>
            <CardDescription className="text-base">
              Total de {stats.totalHoursMonth}h de estudo neste mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">Meta Mensal: 80h</span>
                  <span className="text-base font-bold text-primary">
                    {Math.round((stats.totalHoursMonth / 80) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${Math.min((stats.totalHoursMonth / 80) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base border-2 bg-transparent"
                  onClick={() => router.push("/analytics")}
                >
                  Ver Relatórios Completos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
