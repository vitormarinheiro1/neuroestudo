"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, LayoutDashboard, Book, Clock, BarChart3, Calendar, LogOut, Menu, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { logout } from "@/services/auth.service"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/disciplines", icon: Book, label: "Disciplinas" },
    { href: "/study", icon: Clock, label: "Estudar" },
    { href: "/reviews", icon: Calendar, label: "Revisões" },
    { href: "/analytics", icon: BarChart3, label: "Relatórios" },
    { href: "/settings", icon: Settings, label: "Configurações" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-card hidden lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-border px-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tight">NeuroEstudo</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11 text-base font-medium transition-all",
                      isActive &&
                        "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:text-primary-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-base text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border glass-effect px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">NeuroEstudo</span>
        </div>
        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          {/* Mobile Sidebar */}
          <aside className="fixed right-0 top-0 z-50 h-screen w-72 border-l border-border bg-card lg:hidden animate-in slide-in-from-right">
            <div className="flex h-full flex-col">
              {/* Header with close button */}
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <span className="font-bold text-xl">Menu</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-11 text-base font-medium transition-all",
                          isActive &&
                            "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:text-primary-foreground",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="border-t border-border p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 text-base text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </Button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="container mx-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  )
}
