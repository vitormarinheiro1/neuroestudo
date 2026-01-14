"use client";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Clock, Lightbulb, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listDisciplines,
  type Discipline,
} from "@/services/disciplines.service";
import { createStudySession } from "@/services/sessions.service"

export default function StudyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

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

  // Lógica do Cronômetro
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!selectedDiscipline) return;
    setStartTime(new Date());
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = async () => {
    if (!startTime) return;

    try {
      // Enviando para a API
      await createStudySession({
        disciplina: Number(selectedDiscipline),
        horas: elapsedTime,
        notas: notes,
        data_inicio: startTime.toISOString(),
        data_fim: new Date().toISOString(),
      });

      alert(`Sessão de ${formatTime(elapsedTime)} salva com sucesso!`);

      // Reset de estado
      setIsRunning(false);
      setIsPaused(false);
      setElapsedTime(0);
      setStartTime(null);
      setNotes("");
      // router.push("/dashboard"); // Redireciona para ver o progresso atualizado
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      alert("Houve um erro ao salvar sua sessão no servidor.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Sessão de Estudo
          </h1>
          <p className="text-lg text-muted-foreground">
            Concentre-se e registre seu progresso
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              Cronômetro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {!isRunning && (
              <div className="space-y-3">
                <Label htmlFor="discipline" className="text-base font-semibold">
                  Disciplina
                </Label>
                {disciplines.length === 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/disciplines")}
                  >
                    Cadastrar Disciplina
                  </Button>
                ) : (
                  <Select
                    value={selectedDiscipline}
                    onValueChange={setSelectedDiscipline}
                  >
                    <SelectTrigger id="discipline" className="h-12">
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: d.cor }}
                            />
                            {d.nome} {/* Usando .nome conforme seu service */}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-12">
              <div
                className={`text-7xl font-bold font-mono mb-12 ${
                  isRunning
                    ? isPaused
                      ? "text-muted-foreground"
                      : "text-primary"
                    : "text-foreground"
                }`}
              >
                {formatTime(elapsedTime)}
              </div>

              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    size="lg"
                    onClick={handleStart}
                    disabled={!selectedDiscipline}
                    className="h-14 px-8"
                  >
                    <Play className="mr-2 h-6 w-6" /> Iniciar Sessão
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setIsPaused(!isPaused)}
                      className="h-14 px-8"
                    >
                      {isPaused ? (
                        <Play className="mr-2 h-6 w-6" />
                      ) : (
                        <Pause className="mr-2 h-6 w-6" />
                      )}
                      {isPaused ? "Retomar" : "Pausar"}
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={handleStop}
                      className="h-14 px-8"
                    >
                      <Square className="mr-2 h-6 w-6" /> Finalizar
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isRunning && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Anotações</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="O que você estudou agora?"
                  rows={4}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
