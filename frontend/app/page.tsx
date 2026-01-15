import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Target, TrendingUp, Zap, BarChart3, CheckCircle2, Calendar } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tight">NeuroEstudo</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#benefits"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Benefícios
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-medium shadow-lg shadow-primary/25">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-8">
            <Zap className="w-4 h-4" />
            <span>Método Científico Comprovado</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance leading-[1.1] tracking-tight">
            Seu caminho para a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
              aprovação
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
            Plataforma completa para concurseiros com cronômetro inteligente, revisões baseadas em neurociência e
            análise profunda do seu progresso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 shadow-xl shadow-primary/30">
                Começar Agora - É Grátis
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6 border-2 bg-transparent"
            >
              Ver Demonstração
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">Sem cartão de crédito • Configure em 2 minutos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-24">
          <div className="text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mb-3">
              10k+
            </div>
            <div className="text-sm font-medium text-muted-foreground">Estudantes Aprovados</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mb-3">
              500h+
            </div>
            <div className="text-sm font-medium text-muted-foreground">Média de Estudo</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mb-3">
              95%
            </div>
            <div className="text-sm font-medium text-muted-foreground">Taxa de Satisfação</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Tudo que você precisa para ser aprovado
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Ferramentas inteligentes baseadas em neurociência e aprovadas por milhares de concurseiros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Cronômetro Inteligente</CardTitle>
                <CardDescription className="leading-relaxed">
                  Registre sessões de estudo com precisão. Pausas automáticas e controle total do seu tempo.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-accent/10 hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-accent" />
                </div>
                <CardTitle className="text-xl">Revisão Inteligente</CardTitle>
                <CardDescription className="leading-relaxed">
                  Sistema baseado na Curva do Esquecimento. Revisões programadas nos momentos certos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Análise Detalhada</CardTitle>
                <CardDescription className="leading-relaxed">
                  Gráficos e métricas sobre seu desempenho. Veja seu progresso em tempo real.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-accent/10 hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <CardTitle className="text-xl">Metas e Objetivos</CardTitle>
                <CardDescription className="leading-relaxed">
                  Defina objetivos semanais e mensais. Acompanhe seu cumprimento de metas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Disciplinas Organizadas</CardTitle>
                <CardDescription className="leading-relaxed">
                  Gerencie todas as matérias do seu edital. Controle tópicos, questões e progresso.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-accent/10 hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-accent" />
                </div>
                <CardTitle className="text-xl">Histórico Completo</CardTitle>
                <CardDescription className="leading-relaxed">
                  Todas as suas sessões registradas. Nunca perca o controle dos seus estudos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Por Que Milhares de Concurseiros Escolhem o NeuroEstudo?
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Método Científico Comprovado</h3>
                      <p className="text-muted-foreground">
                        Baseado na Curva do Esquecimento de Ebbinghaus para otimizar sua retenção.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Economia de Tempo</h3>
                      <p className="text-muted-foreground">
                        Automatize o planejamento de revisões e foque apenas em estudar.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Visão Clara do Progresso</h3>
                      <p className="text-muted-foreground">
                        Métricas detalhadas mostram exatamente onde você está e para onde vai.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Sem Surpresas na Prova</h3>
                      <p className="text-muted-foreground">
                        Sistema inteligente garante que você revise tudo no momento certo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <div className="space-y-6">
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Direito Constitucional</span>
                      <span className="text-xs text-muted-foreground">15h esta semana</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Direito Administrativo</span>
                      <span className="text-xs text-muted-foreground">12h esta semana</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Português</span>
                      <span className="text-xs text-muted-foreground">8h esta semana</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total da Semana</span>
                      <span className="text-2xl font-bold text-primary">35h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Comece grátis hoje</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Todas as funcionalidades disponíveis. Sem cartão de crédito.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl">Gratuito</CardTitle>
                <CardDescription className="text-base">Para começar sua jornada</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-lg text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Até 5 disciplinas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Cronômetro de estudos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Revisões automáticas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Métricas básicas</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button className="w-full text-base py-6 bg-transparent" variant="outline">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary border-2 relative shadow-xl shadow-primary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  MAIS POPULAR
                </span>
              </div>
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl">Premium</CardTitle>
                <CardDescription className="text-base">Para concurseiros sérios</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">R$ 29</span>
                  <span className="text-lg text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">Disciplinas ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">Relatórios avançados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">Análise preditiva</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">Suporte prioritário</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium">Backup em nuvem</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button className="w-full text-base py-6 shadow-lg shadow-primary/30">Começar Premium</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-16 border-2 border-primary/20 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Pronto para transformar seus estudos?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de concurseiros que já estão usando o método mais eficaz de preparação.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8 py-6 shadow-xl shadow-primary/30">
                Começar Agora - É Grátis
                <Zap className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">NeuroEstudo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A plataforma completa para concurseiros que buscam aprovação.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>2026 NeuroEstudo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
