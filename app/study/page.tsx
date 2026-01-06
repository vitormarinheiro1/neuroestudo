"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Play, Pause, Square, Clock, Lightbulb } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { getDisciplines, saveStudySession, type StudySession, type Discipline } from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    const data = getDisciplines(currentUser.id)
    setDisciplines(data)
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!selectedDiscipline) {
      alert("Selecione uma disciplina primeiro")
      return
    }

    const now = new Date()
    setStartTime(now)
    setIsRunning(true)
    setIsPaused(false)
    setSessionId(Date.now().toString())
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    if (!user || !sessionId || !startTime) return

    const session: StudySession = {
      id: sessionId,
      userId: user.id,
      disciplineId: selectedDiscipline,
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      duration: elapsedTime,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    }

    saveStudySession(session)

    // Reset
    setIsRunning(false)
    setIsPaused(false)
    setElapsedTime(0)
    setStartTime(null)
    setSessionId(null)
    setNotes("")

    alert(`Sessão de ${formatTime(elapsedTime)} salva com sucesso!`)
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Sessão de Estudo</h1>
          <p className="text-lg text-muted-foreground">Concentre-se e registre seu progresso</p>
        </div>

        {/* Timer Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              Cronômetro
            </CardTitle>
            <CardDescription className="text-base">
              {isRunning
                ? isPaused
                  ? "Pausado - Continue quando estiver pronto"
                  : "Em andamento - Mantenha o foco"
                : "Pronto para começar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Discipline Selection */}
            {!isRunning && (
              <div className="space-y-3">
                <Label htmlFor="discipline" className="text-base font-semibold">
                  Disciplina
                </Label>
                {disciplines.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-6 bg-muted rounded-xl border border-border">
                    Você ainda não tem disciplinas cadastradas.{" "}
                    <button
                      onClick={() => router.push("/disciplines")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Adicionar agora
                    </button>
                  </div>
                ) : (
                  <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                    <SelectTrigger id="discipline" className="h-12 text-base">
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
                )}
              </div>
            )}

            {/* Timer Display */}
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className={`text-7xl font-bold font-mono mb-12 transition-colors ${
                  isRunning ? (isPaused ? "text-muted-foreground" : "text-primary") : "text-foreground"
                }`}
              >
                {formatTime(elapsedTime)}
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    size="lg"
                    onClick={handleStart}
                    disabled={!selectedDiscipline}
                    className="gap-3 h-14 px-8 text-lg shadow-lg shadow-primary/25"
                  >
                    <Play className="w-6 h-6" />
                    Iniciar Sessão
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handlePause}
                      className="gap-3 h-14 px-8 text-lg border-2 bg-transparent"
                    >
                      <Pause className="w-6 h-6" />
                      {isPaused ? "Retomar" : "Pausar"}
                    </Button>
                    <Button size="lg" variant="destructive" onClick={handleStop} className="gap-3 h-14 px-8 text-lg">
                      <Square className="w-6 h-6" />
                      Finalizar
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {isRunning && (
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-semibold">
                  Anotações (opcional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="O que você estudou nesta sessão? Anote os principais tópicos, dúvidas ou insights..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="resize-none text-base"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        {!isRunning && (
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-accent" />
                </div>
                Dicas para uma Sessão Produtiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-base text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl">•</span>
                  <span>Elimine distrações: desligue notificações e redes sociais</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl">•</span>
                  <span>Use a técnica Pomodoro: 25 minutos de foco + 5 minutos de pausa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl">•</span>
                  <span>Mantenha água por perto para se manter hidratado</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl">•</span>
                  <span>Anote dúvidas e conceitos importantes durante o estudo</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
