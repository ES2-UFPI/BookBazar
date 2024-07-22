from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from appbookbazar.serializers import *
from appbookbazar.models import *       
from django.shortcuts import render
from django.contrib import messages
from django.contrib.sessions.models import Session

class Usuario_ViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()

    serializer_class = Usuario_Serializer

@api_view(['POST'])
def Cadastrar_Anuncio(request):
    serializer = Cadastrar_Anuncio_Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def Pesquisar_Anuncios(request):
    search_query = request.query_params.get('search', '')

    if search_query:
        filter_type = request.query_params.get('filter', '')

        if filter_type == 'author':
            anuncios = Anuncio.objects.filter(autor__icontains=search_query)
        elif filter_type == 'title':
            anuncios = Anuncio.objects.filter(titulo__icontains=search_query)
        elif filter_type == 'publisher':
            anuncios = Anuncio.objects.filter(editora__icontains=search_query)
        else:
            anuncios = Anuncio.objects.filter(
                titulo__icontains=search_query) | Anuncio.objects.filter(
                autor__icontains=search_query) | Anuncio.objects.filter(
                editora__icontains=search_query)

    else:
        anuncios = Anuncio.objects.none()  # Retorna uma queryset vazia se não houver search_query

    serializer = Pesquisa_Serializer(anuncios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def Visualizar_Anuncio(request):
    id_anuncio = request.GET.get('id_anuncio', None)

    anuncio = Anuncio.objects.all()

    anuncio = anuncio.filter(id_anuncio=id_anuncio)

    serializer = Visualizar_Anuncio_Serializer(anuncio, many=True, context={'request':request})
    return Response(serializer.data)

@api_view(['GET'])
def chatPage(request):
    sender_username = request.data.get('sender_username', None)
    receiver_username = request.data.get('receiver_username', None)

    context = {
        'sender_username': sender_username,
        'receiver_username': receiver_username
    }
    return render(request, "appbookbazar/novoChat.html", context)

@api_view(['POST'])
def Registrar_Usuario(request):

    username = request.data.get('nome_usuario', None)
    email = request.data.get('email', None)

    if Credentials.objects.filter(username=username).exists():
        messages.error(request, 'Nome de Usuario Cadastrado')
        return Response({'error':'Nome de Usuario Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)

    if Credentials.objects.filter(email=email).exists():
        messages.error(request, 'Email Cadastrado')
        return Response({'error':'Email Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
    
    credentials_data = {
        'username':request.data.get('nome_usuario', None),
        'senha':request.data.get('senha', None),
        'cpf_usuario':request.data.get('cpf_usuario', None),
        'email':request.data.get('email', None)
    }

    user_data = {
        'cpf_usuario':request.data.get('cpf_usuario', None),
        'nome':request.data.get('nome', None),
        'data_nascimento':request.data.get('data_nascimento', None),
        'telefone':request.data.get('telefone', None),
        'email':request.data.get('email', None),
        'cep':request.data.get('cep', None)
    }

    serializer_usuario = Usuario_Serializer(data=user_data)

    if serializer_usuario.is_valid():
        user = serializer_usuario.save()
        
        credentials_data['cpf_usuario'] = user.cpf_usuario
        credentials_data['email'] = user.email
        serializer_credentials = Credentials_Serializer(data=credentials_data)
        
        if serializer_credentials.is_valid():
            serializer_credentials.save()
            response_data = {
                'credentials': serializer_credentials.data,
                'usuario': serializer_usuario.data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error':'Erro no Cadastro - Credentials', 'details': serializer_credentials.errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error':'Erro no Cadastro - Usuario', 'details': serializer_usuario.errors}, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['POST'])
def Logar_Usuario(request):
    username = request.data.get('username', None)
    password = request.data.get('password', None)

    credentials = Credentials.objects.all()
    credentials = credentials.filter(username=username).first()

    if credentials is None:
        return Response({'error':'Nome de Usuario nao Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
    
    if password == credentials.senha:
        request.session['isLoggedIn'] = True
        request.session['username'] = username
        return Response({'message': 'Login Bem Sucedido'}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Senha Incorreta'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def Logout_Usuario(request):
    request.session.flush()
    return Response({'message': 'Logout Bem Sucedido'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def Check_Login(request):
    if request.session.get('isLoggedIn'):
        username = request.session.get('username')
        data = {"username": username}
        return Response(data, status=status.HTTP_200_OK)
    
    return Response({'error': 'Usuario nao Logado'}, status=status.HTTP_400_BAD_REQUEST)
    