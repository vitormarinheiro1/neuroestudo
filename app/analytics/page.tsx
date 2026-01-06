"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, TrendingUp, Calendar, Book } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { getStudySessions, getDisciplines, type StudySession, type Discipline } from "@/lib/storage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DisciplineStats {
  disciplineId: string
  name: string
  color: string
  totalHours: number
  sessionCount: number
  averageSession: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [disciplineStats, setDisciplineStats] = useState<DisciplineStats[]>([])
  const [weeklyHours, setWeeklyHours] = useState<number[]>([])
  const [totalStats, setTotalStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    averageDaily: 0,
    longestSession: 0,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    const sessionsData = getStudySessions(currentUser.id)
    const disciplinesData = getDisciplines(currentUser.id)

    setSessions(sessionsData)
    setDisciplines(disciplinesData)

    calculateStats(sessionsData, disciplinesData)
  }, [router])

  const calculateStats = (sessionsData: StudySession[], disciplinesData: Discipline[]) => {
    // Total stats
    const totalSeconds = sessionsData.reduce((sum, s) => sum + (s.duration || 0), 0)
    const totalHours = totalSeconds / 3600
    const longestSession = Math.max(...sessionsData.map((s) => s.duration || 0), 0) / 3600

    // Calculate days with sessions
    const uniqueDays = new Set(sessionsData.map((s) => new Date(s.startTime).toDateString())).size
    const averageDaily = uniqueDays > 0 ? totalHours / uniqueDays : 0

    setTotalStats({
      totalHours: Math.round(totalHours * 10) / 10,
      totalSessions: sessionsData.length,
      averageDaily: Math.round(averageDaily * 10) / 10,
      longestSession: Math.round(longestSession * 10) / 10,
    })

    // Discipline stats
    const stats: DisciplineStats[] = disciplinesData.map((discipline) => {
      const disciplineSessions = sessionsData.filter((s) => s.disciplineId === discipline.id)
      const totalSeconds = disciplineSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
      const totalHours = totalSeconds / 3600
      const averageSession = disciplineSessions.length > 0 ? totalSeconds / disciplineSessions.length / 3600 : 0

      return {
        disciplineId: discipline.id,
        name: discipline.name,
        color: discipline.color,
        totalHours: Math.round(totalHours * 10) / 10,
        sessionCount: disciplineSessions.length,
        averageSession: Math.round(averageSession * 10) / 10,
      }
    })

    setDisciplineStats(stats.sort((a, b) => b.totalHours - a.totalHours))

    // Weekly hours for last 7 days
    const today = new Date()
    const weekData: number[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const dayHours =
        sessionsData
          .filter((s) => {
            const sessionDate = new Date(s.startTime)
            return sessionDate >= dayStart && sessionDate < dayEnd
          })
          .reduce((sum, s) => sum + (s.duration || 0), 0) / 3600

      weekData.push(Math.round(dayHours * 10) / 10)
    }
    setWeeklyHours(weekData)
  }

  const getWeekDays = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const result: string[] = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      result.push(days[date.getDay()])
    }

    return result
  }

  const maxWeeklyHours = Math.max(...weeklyHours, 1)

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-lg text-muted-foreground">Acompanhe seu desempenho e progresso</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total de Horas
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalStats.totalHours}h</div>
              <p className="text-sm text-muted-foreground mt-1">Tempo total de estudo</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Sessões
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalStats.totalSessions}</div>
              <p className="text-sm text-muted-foreground mt-1">Total de sessões</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Média Diária
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalStats.averageDaily}h</div>
              <p className="text-sm text-muted-foreground mt-1">Por dia com estudo</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Maior Sessão
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalStats.longestSession}h</div>
              <p className="text-sm text-muted-foreground mt-1">Recorde pessoal</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="week" className="space-y-6">
          <TabsList className="h-12">
            <TabsTrigger value="week" className="text-base">
              Última Semana
            </TabsTrigger>
            <TabsTrigger value="disciplines" className="text-base">
              Por Disciplina
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base">
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Atividade dos Últimos 7 Dias</CardTitle>
                <CardDescription className="text-base">Horas de estudo por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getWeekDays().map((day, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base w-16">{day}</span>
                        <span className="text-muted-foreground font-medium">{weeklyHours[index]}h</span>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${(weeklyHours[index] / maxWeeklyHours) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disciplines" className="space-y-4">
            {disciplineStats.length === 0 ? (
              <Card className="border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto">
                      <Book className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-2xl">Nenhum dado disponível</h3>
                      <p className="text-muted-foreground text-base">Comece estudando para ver suas estatísticas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {disciplineStats.map((stat) => (
                  <Card key={stat.disciplineId} className="border-2 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-16 rounded-full" style={{ backgroundColor: stat.color }} />
                        <div>
                          <CardTitle className="text-xl mb-1">{stat.name}</CardTitle>
                          <CardDescription className="text-base">{stat.totalHours}h total</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-3xl font-bold">{stat.sessionCount}</div>
                          <p className="text-sm text-muted-foreground mt-1">Sessões</p>
                        </div>
                        <div>
                          <div className="text-3xl font-bold">{stat.averageSession}h</div>
                          <p className="text-sm text-muted-foreground mt-1">Média/sessão</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-muted-foreground font-medium">Proporção do Total</span>
                          <span className="font-bold text-base">
                            {Math.round((stat.totalHours / totalStats.totalHours) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              backgroundColor: stat.color,
                              width: `${(stat.totalHours / totalStats.totalHours) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Histórico de Sessões</CardTitle>
                <CardDescription className="text-base">
                  Suas últimas {sessions.length} sessões de estudo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-base">
                    Nenhuma sessão registrada ainda
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                      .slice(0, 20)
                      .map((session) => {
                        const discipline = disciplines.find((d) => d.id === session.disciplineId)
                        const duration = (session.duration || 0) / 3600
                        const date = new Date(session.startTime)

                        return (
                          <div
                            key={session.id}
                            className="flex items-center justify-between py-4 border-b last:border-0"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-12 rounded-full" style={{ backgroundColor: discipline?.color }} />
                              <div>
                                <div className="font-semibold text-base">{discipline?.name || "Disciplina"}</div>
                                <div className="text-sm text-muted-foreground">
                                  {date.toLocaleDateString("pt-BR")} às{" "}
                                  {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{Math.round(duration * 10) / 10}h</div>
                              {session.notes && (
                                <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                                  {session.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
