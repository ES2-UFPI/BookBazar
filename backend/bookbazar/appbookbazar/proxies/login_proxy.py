from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from appbookbazar.models import Credentials

class LoginProxy:
    def __init__(self, request):
        self.request = request
        self.username = request.data.get('username', None)
        self.password = request.data.get('password', None)
    
    def _authenticate_user(self):
        credentials = Credentials.objects.filter(username=self.username).first()

        if credentials is None:
            return Response({'error': 'Nome de Usuario nao Cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
        
        if self.password == credentials.senha:
            self.request.session['isLoggedIn'] = True
            self.request.session['username'] = self.username
            return Response({'message': 'Login Bem Sucedido'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Senha Incorreta'}, status=status.HTTP_400_BAD_REQUEST)