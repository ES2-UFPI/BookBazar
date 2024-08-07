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
def Visualizar_Anuncio(request):
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

@api_view(['POST'])
def Registrar_Usuario(request):
    # Extrair dados do corpo da requisição
    username = request.data.get('nome_usuario')
    email = request.data.get('email')
    senha = request.data.get('senha')
    cpf_usuario = request.data.get('cpf_usuario')
    nome = request.data.get('nome')
    data_nascimento = request.data.get('data_nascimento')
    telefone = request.data.get('telefone')

    # Verificar se o nome de usuário já está cadastrado
    if Credentials.objects.filter(username=username).exists():
        return Response({'error': 'Nome de Usuário Já Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
    # Verificar se o e-mail já está cadastrado
    if Credentials.objects.filter(email=email).exists():
        return Response({'error': 'E-mail Já Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)

    # Dados para o modelo Usuario
    user_data = {
        'cpf_usuario': cpf_usuario,
        'nome': nome,
        'data_nascimento': data_nascimento,
        'telefone': telefone,
        'email': email,
    }
    
    # Dados para o modelo Credentials
    credentials_data = {
        'username': username,
        'senha': senha,
        'cpf_usuario': cpf_usuario,
        'email': email,
    }
    print(credentials_data)
    # Validar e salvar o usuário
    serializer_usuario = Usuario_Serializer(data=user_data)
    
    #print(serializer_usuario)
    if serializer_usuario.is_valid():
        
        user = serializer_usuario.save()
        
        # Associar o CPF e o e-mail do usuário à credencial
        credentials_data['cpf_usuario'] = user.cpf_usuario
        credentials_data['email'] = user.email
        
        # Validar e salvar as credenciais
        serializer_credentials = Credentials_Serializer(data=credentials_data)
        if serializer_credentials.is_valid():
            
            serializer_credentials.save()
            response_data = {
                'credentials': serializer_credentials.data,
                'usuario': serializer_usuario.data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Erro ao Cadastrar Credenciais', 'details': serializer_credentials.errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Erro ao Cadastrar Usuário', 'details': serializer_usuario.errors}, status=status.HTTP_400_BAD_REQUEST)
 
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
    if request.session.get('isLoggedIn'):
        serializer = Comentario_Serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response({'error': 'Erro ao Comentar', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'error': 'Usuario nao Logado'}, status=status.HTTP_400_BAD_REQUEST)  

@api_view(['GET'])
def Visualizar_Comentarios(request):
    id_anuncio = request.data.get('id_anuncio', None)

    id_anuncio = Comentario.objects.filter(id_anuncio=id_anuncio)
    comentario_serializer = Comentario_Serializer(id_anuncio, context={'request':request})

    try:
        return Response(comentario_serializer, status=status.HTTP_200_OK)
    except:
        return Response({'erro': 'Erro ao Recuperar Comentarios', 'details': comentario_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
def Visualizar_Perfil(request):
    username = request.data.get('username', None)
    
    if username is not None:

        credenciais = Credentials.objects.get(username=username)

        if credenciais is None:
            return Response({'error': 'Credenciais nao Encontradas'}, status=status.HTTP_404_NOT_FOUND)

        user_data = {
            'email': credenciais.email.email
        }

        usuario = Usuario.objects.get(email=user_data['email'])
        #serializer = Usuario_Serializer(usuario, context={'request':request})
        #return Response(serializer.data, status=status.HTTP_200_OK)

        if request.session.get('isLoggedIn') and username == request.session['username']:
            response_data = {
                'username': credenciais.username,
                'password': credenciais.senha,
                'cpf_usuario': credenciais.cpf_usuario.cpf_usuario,
                'email': credenciais.email.email,
                'nome': usuario.nome,
                'data_nascimento': usuario.data_nascimento,
                'telefone': usuario.telefone
            }

            return Response(response_data, status=status.HTTP_200_OK)
    
        if request.session.get('isLoggedIn') and username != request.session['username']:
            response_data = {
                'username': credenciais.username,
                'email': credenciais.email.email,
                'nome': usuario.nome,
            }
            return Response(response_data, status=status.HTTP_200_OK)
    
        return Response({'erro': 'Erro ao Recuperar Perfil'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'erro': 'Username nao Provido'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def Alterar_Cadastro(request):
    if request.session.get('isLoggedIn'):
        new_username = request.data.get('username', None)
        new_password = request.data.get('password', None)
        new_email = request.data.get('email', None)

        new_name = request.data.get('nome', None)
        new_phone = request.data.get('telefone', None)

        #username_cadastrado = Credentials.objects.filter(username=new_username)

        #if username_cadastrado is not None:
        #    return Response({'error': 'Username ja Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)

        #email_cadastrado = Usuario.objects.filter(email=new_email)

        #if email_cadastrado is not None:
        #    return Response({'error': 'Email ja Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)

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
    if request.session.get('isLoggedIn'):
        sender_username = request.session['username']
        receiver_username = request.data.get('receiver_username', None)

        chat_id_list = sorted([sender_username, receiver_username])
        chat_id = "_".join(chat_id_list)

        horario_mensagem = datetime.now()

        conteudo_mensagem = request.data.get('mensagem', None)

        mensagem_data = {
            "sender_username": sender_username,
            "receiver_username": receiver_username,
            "chat_id": chat_id,
            "horario_mensagem": horario_mensagem,
            "conteudo_mensagem": conteudo_mensagem
        }

        serializer_mensagem = Mensagem_Serializer(data=mensagem_data)

        if serializer_mensagem.is_valid():
            serializer_mensagem.save()

            response_data = {
                'mensagem': serializer_mensagem.data
            }

            return Response(response_data, status=status.HTTP_200_OK)
        return Response({'error': 'Mensagem Serializer Error', 'details': serializer_mensagem.errors}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Erro de Sistema'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def Recuperar_Mensagens(request):
    if request.session.get('isLoggedIn'):
        myself = request.session.get('username')
        other = request.data.get('receiver_username', None)

        chat_list = sorted([myself, other])
        chat_id = "_".join(chat_list)

        mensagens_recuperadas = Mensagem.objects.filter(chat_id=chat_id)

        serializer_mensagem = Mensagem_Serializer(mensagens_recuperadas, many=True, context={'request':request})

        if serializer_mensagem.is_valid():
            return Response(serializer_mensagem.data, status=status.HTTP_200_OK)
        return Response({'error': 'Mensagem Serializer Error', 'details': serializer_mensagem.errors}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Erro de Sistema'}, status=status.HTTP_401_UNAUTHORIZED)