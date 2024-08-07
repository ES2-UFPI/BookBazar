from django.urls import path, include
from django.contrib import admin
from appbookbazar.views import *
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'cadastrarusuario', Usuario_ViewSet)

urlpatterns = [
    path('api/anunciar/', Cadastrar_Anuncio),
    path('api/visualizar/', Visualizar_Anuncio),
    path('api/pesquisar/', Pesquisar_Anuncios),
    path('api/registrar/', Registrar_Usuario),
    path('api/login/', Logar_Usuario),
    path('api/logout/', Logout_Usuario),
    path('api/checarlogin/', Check_Login),
    path('api/comentar/', Comentar),
    path('api/recuperarComentarios/', Visualizar_Comentarios),
    path('api/recuperarPerfil/', Visualizar_Perfil),
    path('api/alterarCadastro/', Alterar_Cadastro),
    path('api/postarMensagem/', Enviar_Mensagem),
    path('api/recuperarChat/', Recuperar_Mensagens),
    path('api/recuperarChats/', Recuperar_Chats),
    path('<str:sender_username>/<str:receiver_username>/', chatPage, name='chat'),
    path('', include(router.urls)),
    path('api-auth', include('rest_framework.urls')),
]