from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    username = None
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nome_completo"]

    def __str__(self):
        return self.nome_completo


class Disciplina(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="disciplinas"
    )
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class SessaoEstudo(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="sessoes"
    )
    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name="sessoes"
    )
    horas = models.IntegerField()  # ou minutos
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.disciplina.nome} - {self.horas}h"


class Revisao(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="revisoes"
    )
    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name="revisoes"
    )
    topico = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.topico
