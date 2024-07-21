from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *


class Usuario_ViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = Usuario_Serializer

@api_view(['POST'])
def Cadastrar_Anuncio(request):
    serializer = Cadastrar_Anuncio_Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            anuncios = Anuncio.objects.filter(titulo__icontains=search_query) | Anuncio.objects.filter(
                autor__icontains=search_query) | Anuncio.objects.filter(editora__icontains=search_query)
    else:
        anuncios = Anuncio.objects.none()  # Retorna uma queryset vazia se não houver search_query

    serializer = Pesquisa_Serializer(anuncios, many=True, context={'request': request})
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
            return Response({"error": "Anúncio não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "ID do anúncio não fornecido."}, status=status.HTTP_400_BAD_REQUEST)
