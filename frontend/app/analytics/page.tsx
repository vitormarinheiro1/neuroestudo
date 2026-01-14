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
import {
  BarChart3,
  Clock,
  TrendingUp,
  Calendar,
  Book,
  Brain,
  History,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importação dos seus Services Reais
import {
  listStudySessions,
  type StudySession,
} from "@/services/sessions.service";
import {
  listDisciplines,
  type Discipline,
} from "@/services/disciplines.service";

interface DisciplineStats {
  disciplineId: number;
  name: string;
  color: string;
  totalHours: number;
  sessionCount: number;
  averageSession: number;
}

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [disciplineStats, setDisciplineStats] = useState<DisciplineStats[]>([]);
  const [weeklyHours, setWeeklyHours] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    averageDaily: 0,
    longestSession: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sessionsData, disciplinesData] = await Promise.all([
          listStudySessions(),
          listDisciplines(),
        ]);

        setSessions(sessionsData);
        setDisciplines(disciplinesData);
        calculateStats(sessionsData, disciplinesData);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const calculateStats = (
    sessionsData: StudySession[],
    disciplinesData: Discipline[]
  ) => {
    // 1. Cálculos Totais
    const totalHoursRaw = sessionsData.reduce(
      (sum, s) => sum + (Number(s.horas) || 0),
      0
    );
    const longestSessionRaw = Math.max(
      ...sessionsData.map((s) => Number(s.horas) || 0),
      0
    );

    const uniqueDays = new Set(
      sessionsData.map((s) => new Date(s.data_inicio).toDateString())
    ).size;

    const averageDaily = uniqueDays > 0 ? totalHoursRaw / uniqueDays : 0;

    setTotalStats({
      totalHours: Math.round(totalHoursRaw * 10) / 10,
      totalSessions: sessionsData.length,
      averageDaily: Math.round(averageDaily * 10) / 10,
      longestSession: Math.round(longestSessionRaw * 10) / 10,
    });

    // 2. Stats por Disciplina
    const stats: DisciplineStats[] = disciplinesData.map((discipline) => {
      const disciplineSessions = sessionsData.filter(
        (s) => s.disciplina === discipline.id
      );
      const dHours = disciplineSessions.reduce(
        (sum, s) => sum + (Number(s.horas) || 0),
        0
      );
      const dAverage =
        disciplineSessions.length > 0 ? dHours / disciplineSessions.length : 0;

      return {
        disciplineId: discipline.id,
        name: discipline.nome,
        color: discipline.cor,
        totalHours: Math.round(dHours * 10) / 10,
        sessionCount: disciplineSessions.length,
        averageSession: Math.round(dAverage * 10) / 10,
      };
    });

    setDisciplineStats(stats.sort((a, b) => b.totalHours - a.totalHours));

    // 3. Gráfico Semanal (Últimos 7 dias)
    const today = new Date();
    const weekData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayHours = sessionsData
        .filter((s) => {
          const sDate = new Date(s.data_inicio);
          return sDate >= dayStart && sDate <= dayEnd;
        })
        .reduce((sum, s) => sum + (Number(s.horas) || 0), 0);

      weekData.push(Math.round(dayHours * 10) / 10);
    }
    setWeeklyHours(weekData);
  };

  const getWeekDays = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const result: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push(days[date.getDay()]);
    }
    return result;
  };

  const maxWeeklyHours = Math.max(...weeklyHours, 0.1);

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center animate-pulse">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Processando estatísticas...</p>
          </div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Relatórios e Análises
          </h1>
          <p className="text-lg text-muted-foreground">
            Desempenho real baseado no seu histórico de estudo
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
                Total Horas
              </CardTitle>
              <Clock className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStats.totalHours}h</div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
                Sessões
              </CardTitle>
              <BarChart3 className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {totalStats.totalSessions}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
                Média Diária
              </CardTitle>
              <Calendar className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalStats.averageDaily}h
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
                Maior Sessão
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {totalStats.longestSession}h
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="week" className="space-y-6">
          <TabsList className="bg-muted p-1 rounded-lg">
            <TabsTrigger value="week" className="px-6">
              Última Semana
            </TabsTrigger>
            <TabsTrigger value="disciplines" className="px-6">
              Por Disciplina
            </TabsTrigger>
            <TabsTrigger value="history" className="px-6">
              Histórico Completo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Horas Estudadas nos Últimos 7 Dias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getWeekDays().map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{day}</span>
                      <span className="text-primary">
                        {weeklyHours[index]}h
                      </span>
                    </div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-700 ease-out"
                        style={{
                          width: `${
                            (weeklyHours[index] / maxWeeklyHours) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="disciplines"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {disciplineStats.length === 0 ? (
              <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                Nenhum dado por disciplina disponível.
              </div>
            ) : (
              disciplineStats.map((stat) => (
                <Card
                  key={stat.disciplineId}
                  className="border-2 hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <CardTitle>{stat.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-3xl font-bold">{stat.totalHours}h</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Tempo Total
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {stat.sessionCount}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Sessões
                        </p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span>Média por sessão: {stat.averageSession}h</span>
                        <span>
                          {Math.round(
                            (stat.totalHours / totalStats.totalHours) * 100
                          )}
                          % do total
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            backgroundColor: stat.color,
                            width: `${
                              (stat.totalHours / totalStats.totalHours) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-2">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {sessions.length === 0 ? (
                    <p className="p-10 text-center text-muted-foreground">
                      Nenhuma sessão encontrada.
                    </p>
                  ) : (
                    sessions
                      .sort(
                        (a, b) =>
                          new Date(b.data_inicio).getTime() -
                          new Date(a.data_inicio).getTime()
                      )
                      .map((session) => {
                        const disc = disciplines.find(
                          (d) => d.id === session.disciplina
                        );
                        return (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-1.5 h-10 rounded-full"
                                style={{ backgroundColor: disc?.cor || "#ccc" }}
                              />
                              <div>
                                <p className="font-bold text-sm md:text-base">
                                  {disc?.nome || "Sem Nome"}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(
                                    session.data_inicio
                                  ).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black">
                                {Number(session.horas).toFixed(2)}h
                              </span>
                              {session.notas && (
                                <p className="text-[10px] text-muted-foreground max-w-[150px] truncate">
                                  {session.notas}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
