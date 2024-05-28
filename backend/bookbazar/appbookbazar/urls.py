from django.urls import path, include
from django.contrib import admin
from appbookbazar.views import *
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'cadastrarusuario', Usuario_ViewSet)

urlpatterns = [
    path('api/anunciar/', Cadastrar_Anuncio),
    #path('api/visualizar/', Visualizar_Anuncio),
    path('api/pesquisar/', Pesquisar_Anuncios),
    path('', include(router.urls)),
    path('api-auth', include('rest_framework.urls')),
]