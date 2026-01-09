from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, Disciplina, SessaoEstudo, Revisao


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "nome_completo",
            "email",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data["email"]
        password = data["password"]

        try:
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Email ou senha inválidos")

        if not user.is_active:
            raise serializers.ValidationError("Usuário inativo")

        if not user.check_password(password):
            raise serializers.ValidationError("Email ou senha inválidos")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UsuarioSerializer(user).data
        }


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "nome_completo",
            "email",
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
