"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Settings,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Cookies from "js-cookie";
import { updateProfile, changePassword } from "@/services/users.service";

export default function SettingsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carrega dados do cookie que salvamos no login
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        setUserId(userData.id);
        setName(userData.nome_completo || "");
        setEmail(userData.email || "");
      } catch (e) {
        console.error("Erro ao ler cookie do usuário");
      }
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!userId) return;

    setLoading(true);
    try {
      const updatedUser = await updateProfile(userId, {
        nome_completo: name,
        email: email,
      });

      // Atualiza o cookie com os novos dados para refletir no restante do app
      Cookies.set("user", JSON.stringify(updatedUser));
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.detail || "Erro ao atualizar perfil.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "A nova senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setLoading(true);
    try {
      // Chama o endpoint change-password do seu UsuarioViewSet
      await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      });

      setMessage({ type: "success", text: "Senha alterada com sucesso!" });

      // Limpa os campos de senha
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      // Captura a mensagem "Senha atual incorreta" enviada pelo seu Django
      const errorMsg = error.response?.data?.detail || "Erro ao alterar senha.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Gerencie suas informações pessoais e segurança
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <Card
            className={
              message.type === "success"
                ? "border-accent"
                : "border-destructive"
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {message.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <p
                  className={
                    message.type === "success"
                      ? "text-accent"
                      : "text-destructive"
                  }
                >
                  {message.text}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-5 h-5 mr-2" />
                  )}
                  Salvar alterações
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Segurança</CardTitle>
                  <CardDescription>Altere sua senha de acesso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="current-password"
                    className="text-base font-medium"
                  >
                    Senha atual
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="new-password"
                    className="text-base font-medium"
                  >
                    Nova senha
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password"
                    className="text-base font-medium"
                  >
                    Confirmar nova senha
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5 mr-2" />
                  )}
                  Alterar senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
