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
import { Clock, Book, Target, Play, Calendar, Flame } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { listStudySessions } from "@/services/sessions.service";
import { listDisciplines } from "@/services/disciplines.service";
import { listReviews } from "@/services/reviews.service";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    totalHoursToday: 0,
    totalHoursWeek: 0,
    totalHoursMonth: 0,
    totalDisciplines: 0,
    reviewsToday: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    async function loadDashboardData() {
      const userCookie = Cookies.get("user");
      try {
        // Decodifica o nome do cookie
        const userData = JSON.parse(decodeURIComponent(userCookie || "{}"));
        setUserName(userData.nome_completo || "Estudante");

        // Busca dados da API
        const [sessions, disciplines, reviews] = await Promise.all([
          listStudySessions(),
          listDisciplines(),
          listReviews(),
        ]);

        const now = new Date();
        const endOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        );
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        // 1. FILTRO DE REVISÕES (Usando seu campo 'data_proxima')
        const pendingTodayCount = reviews.filter((r: any) => {
          const dataProxima = new Date(r.data_proxima);
          return dataProxima <= endOfToday;
        }).length;

        // 2. CÁLCULO DE HORAS
        const weekAgo = new Date(
          todayStart.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        const monthAgo = new Date(
          todayStart.getTime() - 30 * 24 * 60 * 60 * 1000
        );

        const totalHoursToday = sessions
          .filter((s) => new Date(s.data_inicio) >= todayStart)
          .reduce((sum, s) => sum + (Number(s.horas) || 0), 0);

        const totalHoursWeek = sessions
          .filter((s) => new Date(s.data_inicio) >= weekAgo)
          .reduce((sum, s) => sum + (Number(s.horas) || 0), 0);

        const totalHoursMonth = sessions
          .filter((s) => new Date(s.data_inicio) >= monthAgo)
          .reduce((sum, s) => sum + (Number(s.horas) || 0), 0);

        // 3. CÁLCULO DE STREAK
        let streak = 0;
        const checkDate = new Date(todayStart);
        const sessionDates = new Set(
          sessions.map((s) => new Date(s.data_inicio).toDateString())
        );

        while (sessionDates.has(checkDate.toDateString())) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        // ATUALIZAÇÃO DO ESTADO
        setStats({
          totalHoursToday: Math.round(totalHoursToday * 10) / 10,
          totalHoursWeek: Math.round(totalHoursWeek * 10) / 10,
          totalHoursMonth: Math.round(totalHoursMonth * 10) / 10,
          totalDisciplines: disciplines.length,
          reviewsToday: pendingTodayCount, // <--- AQUI ESTAVA O ERRO (usando count filtrado)
          currentStreak: streak,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do banco:", error);
      }
    }

    loadDashboardData();
  }, [router]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          {/* Usando o campo 'nome' que costuma vir do Django */}
          <h1 className="text-4xl font-bold tracking-tight">
            Olá, {userName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Aqui está seu resumo de hoje
          </p>
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
              <div className="text-3xl font-bold text-primary">
                {stats.totalHoursToday}h
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Horas de estudo
              </p>
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
              <div className="text-3xl font-bold text-accent">
                {stats.totalHoursWeek}h
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total semanal
              </p>
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
              <div className="text-3xl font-bold text-primary">
                {stats.totalDisciplines}
              </div>
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
              <div className="text-3xl font-bold text-accent">
                {stats.currentStreak}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Dias consecutivos
              </p>
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
              <CardDescription className="text-base">
                Comece uma nova sessão com cronômetro inteligente
              </CardDescription>
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
                  <span className="text-base font-semibold">
                    Meta Mensal: 80h
                  </span>
                  <span className="text-base font-bold text-primary">
                    {Math.round((stats.totalHoursMonth / 80) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (stats.totalHoursMonth / 80) * 100,
                        100
                      )}%`,
                    }}
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
  );
}
