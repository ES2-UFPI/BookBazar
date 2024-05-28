from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from appbookbazar.serializers import *
from appbookbazar.models import *       
from appbookbazar.utils import calcula_distancia
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