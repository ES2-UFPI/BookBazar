from django.urls import path, include
from django.contrib import admin
from appbookbazar.views import *
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'cadastrarusuario', Usuario_ViewSet)

urlpatterns = [
    path('api/anunciar/', cadastrar_anuncio),
    path('api/visualizar/', visualizar_anuncio_por_id),
    path('api/pesquisar/', pesquisar_anuncios),
    path('api/registrar/', registrar_usuario),
    path('api/login/', logar_usuario),
    path('api/logout/', logout_usuario),
    path('api/checarlogin/', check_login),
    path('api/comentar/', comentar),
    path('api/recuperarComentarios/', visualizar_comentarios),
    path('api/recuperarPerfil/', visualizar_perfil),
    path('api/alterarCadastro/', alterar_cadastro),
    path('api/postarMensagem/', enviar_mensagem),
    path('api/recuperarChat/', recuperar_mensagens),
    path('api/recuperarChats/', recuperar_chats),
    path('<str:sender_username>/<str:receiver_username>/', chatPage, name='chat'),
    path('', include(router.urls)),
    path('api-auth', include('rest_framework.urls')),
]