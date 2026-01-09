from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from studyplanner.views import (
    LoginView,
    RegisterView,
    UsuarioViewSet,
    DisciplinaViewSet,
    SessaoEstudoViewSet,
    RevisaoViewSet
)

router = routers.DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuarios')
router.register('disciplinas', DisciplinaViewSet, basename='disciplinas')
router.register('sessoes', SessaoEstudoViewSet, basename='sessoes')
router.register('revisoes', RevisaoViewSet, basename='revisoes')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
