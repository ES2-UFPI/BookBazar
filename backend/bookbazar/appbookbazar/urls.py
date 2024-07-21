from django.urls import path, include
from rest_framework import routers
from .views import Usuario_ViewSet, Cadastrar_Anuncio, Pesquisar_Anuncios, Visualizar_Anuncio

router = routers.DefaultRouter()
router.register(r'cadastrarusuario', Usuario_ViewSet)

urlpatterns = [
    path('api/anunciar/', Cadastrar_Anuncio),
    path('api/visualizar/', Visualizar_Anuncio),
    path('api/pesquisar/', Pesquisar_Anuncios),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
