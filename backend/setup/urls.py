from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, permissions
from rest_framework.permissions import IsAdminUser
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from studyplanner.views import (
    LoginView,
    RegisterView,
    UsuarioViewSet,
    DisciplinaViewSet,
    SessaoEstudoViewSet,
    RevisaoViewSet,
)


router = routers.DefaultRouter()
router.register("usuarios", UsuarioViewSet, basename="usuarios")
router.register("disciplinas", DisciplinaViewSet, basename="disciplinas")
router.register("sessoes", SessaoEstudoViewSet, basename="sessoes")
router.register("revisoes", RevisaoViewSet, basename="revisoes")

schema_view = get_schema_view(
    openapi.Info(
        title="API Study Planner",
        default_version="v1",
        description="Documentação da API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="vitormarinheiro9@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=False,
    permission_classes=(IsAdminUser,),
)
urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("", include(router.urls)),
]
