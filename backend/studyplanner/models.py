from decimal import Decimal
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email é obrigatório")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser precisa ter is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser precisa ter is_superuser=True")

        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nome_completo"]

    objects = UsuarioManager()

    def __str__(self):
        return self.nome_completo


class Disciplina(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="disciplinas"
    )
    nome = models.CharField(max_length=255)
    meta_semanal = models.PositiveIntegerField(default=10)
    cor = models.CharField(max_length=7, default="#3b82f6")

    def __str__(self):
        return self.nome


class SessaoEstudo(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="sessoes"
    )
    disciplina = models.ForeignKey(
        Disciplina, on_delete=models.CASCADE, related_name="sessoes"
    )
    horas = models.DecimalField(max_digits=7, decimal_places=4)
    notas = models.TextField(blank=True, null=True)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.disciplina.nome} - {self.horas}h"


class Revisao(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="revisoes"
    )
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    topico = models.CharField(max_length=255)

    data_ultima = models.DateTimeField()
    data_proxima = models.DateTimeField()
    intervalo = models.IntegerField(default=1)
    facilidade = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal("2.50")
    )
    repeticoes = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topico} ({self.disciplina.nome})"
