from rest_framework import viewsets
from .models import Usuario, Disciplina, SessaoEstudo, Revisao
from .serializers import (
    ChangePasswordSerializer,
    UsuarioSerializer,
    DisciplinaSerializer,
    SessaoEstudoSerializer,
    RevisaoSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from .serializers import LoginSerializer
from .serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "nome_completo": user.nome_completo,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=["post"], url_path="change-password")
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"detail": "Senha atual incorreta"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"detail": "Senha alterada com sucesso"},
            status=status.HTTP_200_OK,
        )


class DisciplinaViewSet(viewsets.ModelViewSet):
    serializer_class = DisciplinaSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return Disciplina.objects.all()

        return Disciplina.objects.filter(usuario=user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class SessaoEstudoViewSet(viewsets.ModelViewSet):
    serializer_class = SessaoEstudoSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return SessaoEstudo.objects.all()

        return SessaoEstudo.objects.filter(usuario=user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class RevisaoViewSet(viewsets.ModelViewSet):
    serializer_class = RevisaoSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return Revisao.objects.all()

        return Revisao.objects.filter(usuario=user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
