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
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.db.models import Q
from .proxies.login_proxy import LoginProxy

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
    filter_type = request.query_params.get('filter', '')

    latitude_usuario = float(request.query_params.get('latitude_usuario', 0))
    longitude_usuario = float(request.query_params.get('longitude_usuario', 0))

    if search_query:

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

    serializer = Pesquisa_Serializer(anuncios, many=True, context={'request':request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def visualizar_anuncio_por_id(request):
    id_anuncio = request.GET.get('id_anuncio', None)

    if id_anuncio:
        try:
            anuncio = Anuncio.objects.get(id_anuncio=id_anuncio)
            serializer = Visualizar_Anuncio_Serializer(anuncio, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Anuncio.DoesNotExist:
            return Response({"error": "Anuncio nao encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "ID do Anuncio nao Fornecido"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def chatPage(request):
    sender_username = request.data.get('sender_username', None)
    receiver_username = request.data.get('receiver_username', None)

    context = {
        'sender_username': sender_username,
        'receiver_username': receiver_username
    }
    return render(request, "appbookbazar/novoChat.html", context)

def validar_usuario(username, email):
    if Credentials.objects.filter(username=username).exists():
        return {'error': 'Nome de Usuário Já Cadastrado'}, status.HTTP_400_BAD_REQUEST
    if Credentials.objects.filter(email=email).exists():
        return {'error': 'E-mail Já Cadastrado'}, status.HTTP_400_BAD_REQUEST
    return None, None

def salvar_usuario(user_data, credentials_data):
    serializer_usuario = Usuario_Serializer(data=user_data)
    if serializer_usuario.is_valid():
        user = serializer_usuario.save()
        credentials_data['cpf_usuario'] = user.cpf_usuario
        credentials_data['email'] = user.email
        serializer_credentials = Credentials_Serializer(data=credentials_data)
        if serializer_credentials.is_valid():
            serializer_credentials.save()
            return {
                'credentials': serializer_credentials.data,
                'usuario': serializer_usuario.data
            }, status.HTTP_201_CREATED
    return None, status.HTTP_400_BAD_REQUEST

@api_view(['POST'])
def Registrar_Usuario(request):
    username = request.data.get('nome_usuario')
    email = request.data.get('email')
    senha = request.data.get('senha')
    cpf_usuario = request.data.get('cpf_usuario')
    nome = request.data.get('nome')
    data_nascimento = request.data.get('data_nascimento')
    telefone = request.data.get('telefone')

    # Validação
    error_response, error_status = validar_usuario(username, email)
    if error_response:
        return Response(error_response, status=error_status)

    # Dados para o modelo Usuario e Credentials
    user_data = {
        'cpf_usuario': cpf_usuario,
        'nome': nome,
        'data_nascimento': data_nascimento,
        'telefone': telefone,
        'email': email,
    }
    
    credentials_data = {
        'username': username,
        'senha': senha,
        'cpf_usuario': cpf_usuario,
        'email': email,
    }

    # Salvar usuário e credenciais
    response_data, status_code = salvar_usuario(user_data, credentials_data)
    if response_data:
        return Response(response_data, status=status_code)
    return Response({'error': 'Erro ao Cadastrar Usuário ou Credenciais'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def Logar_Usuario(request):
    proxy = LoginProxy(request)
    return proxy._authenticate_user()

@api_view(['GET'])
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

@api_view(['POST'])
def Comentar(request):
    print("Dados recebidos:", request.data)

    serializer = Comentario_Serializer(data=request.data)
        
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    return Response({'error': 'Usuario nao Logado'}, status=status.HTTP_400_BAD_REQUEST)  

@api_view(['GET'])
def Visualizar_Comentarios(request):
    id_anuncio = request.GET.get('id_anuncio', None)
    if id_anuncio is None:
        return Response({'erro': 'ID do anúncio não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        comentarios = Comentario.objects.filter(id_anuncio=id_anuncio)
        comentario_serializer = Comentario_Serializer(comentarios, many=True, context={'request': request})
        response_data = comentario_serializer.data
        return Response(comentario_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'erro': 'Erro ao recuperar comentários', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
def Visualizar_Perfil(request):
    username = request.query_params.get('username', None)  # Usar query_params para GET

    if username is not None:
        try:
            credenciais = Credentials.objects.get(username=username)
            usuario = Usuario.objects.get(email=credenciais.email.email)
        except Credentials.DoesNotExist:
            return Response({'error': 'Credenciais não encontradas'}, status=status.HTTP_404_NOT_FOUND)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = Usuario_Serializer(usuario, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response({'error': 'Username não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def Alterar_Cadastro(request):
    if request.session.get('isLoggedIn'):
        new_username = request.data.get('username', None)
        new_password = request.data.get('password', None)
        new_email = request.data.get('email', None)

        new_name = request.data.get('nome', None)
        new_phone = request.data.get('telefone', None)

        credentials_object = Credentials.objects.get(username=request.session['username'])

        old_username = request.session.get('username')

        email = credentials_object.email.email

        usuario_object = Usuario.objects.get(email=email)

        credential_update_data = {
            'username': new_username,
            'senha': new_password,
            'email': new_email
        }

        usuario_update_data = {
            'nome': new_name,
            'telefone': new_phone,
            'email': new_email
        }

        usuario_serializer = Usuario_Update_Serializer(usuario_object, data=usuario_update_data)

        credentials_object.email.email = new_email
        credentials_object.save()

        if usuario_serializer.is_valid():
            usuario = usuario_serializer.save()
            credential_update_data['email'] = usuario.email
            
            credential_serializer = Credentials_Update_Serializer(credentials_object, data=credential_update_data, partial=True)
            if credential_serializer.is_valid():
                credential_serializer.save()
                request.session['username'] = new_username

                old_credentials = Credentials.objects.filter(username=old_username)
                old_credentials.delete()

                response_data = {
                    'credential': credential_serializer.data,
                    'usuario': usuario_serializer.data
                }
                return Response(response_data, status=status.HTTP_202_ACCEPTED)
            return Response({'error': 'Credential Serializer Error', 'details': credential_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Usuario Serializer Error', 'details': usuario_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'error':'Erro na Alteracao de Cadastro'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def Enviar_Mensagem(request):
    
    sender_username = request.data.get('sender_username')
    receiver_username = request.data.get('receiver_username')
    conteudo_mensagem = request.data.get('conteudo_mensagem')

    if sender_username and receiver_username and conteudo_mensagem:
        horario_mensagem = datetime.now()

        mensagem_data = {
            "sender_username": sender_username,
            "receiver_username": receiver_username,
            #"chat_id": None,  # O campo chat_id pode ser mantido como None se não estiver usando mais
            "horario_mensagem": horario_mensagem,
            "conteudo_mensagem": conteudo_mensagem
        }
        print(mensagem_data)
        serializer_mensagem = Mensagem_Serializer(data=mensagem_data)

        if serializer_mensagem.is_valid():
            serializer_mensagem.save()
            response_data = {'mensagem': serializer_mensagem.data}
            return Response(response_data, status=status.HTTP_200_OK)
        return Response({'error': 'Mensagem Serializer Error', 'details': serializer_mensagem.errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'error': 'Dados insuficientes'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def Recuperar_Mensagens(request):
    sender_username = request.query_params.get('sender_username')
    receiver_username = request.query_params.get('receiver_username')

    if sender_username and receiver_username:
        mensagens_recuperadas = Mensagem.objects.filter(
            (Q(sender_username=sender_username) & Q(receiver_username=receiver_username)) |
            (Q(sender_username=receiver_username) & Q(receiver_username=sender_username))
        ).order_by('horario_mensagem')

        serializer_mensagem = Mensagem_Serializer(mensagens_recuperadas, many=True, context={'request': request})
        print(mensagens_recuperadas)
        return Response(serializer_mensagem.data, status=status.HTTP_200_OK)
    
    return Response({'error': 'Dados insuficientes'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def Recuperar_Chats(request):
    username = request.query_params.get('username')
    if username:
        # Obter todos os chats onde o usuário é o remetente
        chats_from_sender = Mensagem.objects.filter(sender_username=username).values('receiver_username').distinct()
        # Obter todos os chats onde o usuário é o destinatário
        chats_from_receiver = Mensagem.objects.filter(receiver_username=username).values('sender_username').distinct()

        # Combine os dois QuerySets usando `union()`
        combined_chats = chats_from_sender.union(chats_from_receiver)

        # Cria um conjunto para armazenar usernames únicos
        unique_usernames = set()

        for chat in combined_chats:
            if 'receiver_username' in chat:
                unique_usernames.add(chat['receiver_username'])
            if 'sender_username' in chat:
                unique_usernames.add(chat['sender_username'])

        # Remove o próprio username da lista de usuários
        unique_usernames.discard(username)

        # Converte o conjunto de usernames em uma lista de dicionários
        chat_list = [{'username': user} for user in unique_usernames]

        return Response(chat_list, status=status.HTTP_200_OK)

    return Response({'error': 'Dados insuficientes'}, status=status.HTTP_400_BAD_REQUEST)