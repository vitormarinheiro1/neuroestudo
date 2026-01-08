from rest_framework import viewsets
from .models import Usuario, Disciplina, SessaoEstudo, Revisao
from .serializers import (
    UsuarioSerializer,
    DisciplinaSerializer,
    SessaoEstudoSerializer,
    RevisaoSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class DisciplinaViewSet(viewsets.ModelViewSet):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer


class SessaoEstudoViewSet(viewsets.ModelViewSet):
    queryset = SessaoEstudo.objects.all()
    serializer_class = SessaoEstudoSerializer


class RevisaoViewSet(viewsets.ModelViewSet):
    queryset = Revisao.objects.all()
    serializer_class = RevisaoSerializer
