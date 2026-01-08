from rest_framework import serializers
from .models import Usuario, Disciplina, SessaoEstudo, Revisao


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "nome_completo",
            "email",
            "username"
        ]
        read_only_fields = ["id"]


class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = "__all__"


class SessaoEstudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessaoEstudo
        fields = "__all__"


class RevisaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revisao
        fields = "__all__"
