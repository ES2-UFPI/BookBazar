from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.test import TestCase
from appbookbazar.models import Usuario, Credentials

class UsuarioTests(APITestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create(
            cpf_usuario="44467899954",
            nome="Test User",
            data_nascimento="2000-01-01",
            telefone="1234567890",
            email="testuser@example.com"
        )
        
        self.credentials = Credentials.objects.create(
            username="testuser",
            senha="testpass",
            email=self.usuario,
            cpf_usuario=self.usuario
        )
        

    def test_registrar_usuario(self):
        url = '/api/registrar/'

        data = {
            'nome_usuario': 'newuser',
            'email': 'newuser@example.com',
            'senha': 'newpass',
            'cpf_usuario': '12345678902',
            'nome': 'New User',
            'data_nascimento': '1990-01-01',
            'telefone': '0987654321'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        

class UsuarioModelTests(TestCase):

    def test_usuario_creation(self):
        cpf = "55599988823"

        usuario = Usuario.objects.create(
            cpf_usuario=cpf,
            nome="Usuario de Teste",
            data_nascimento="2000-01-01",
            telefone="1234567890",
            email="emaildeteste@outlook.com"
        )
        self.assertEqual(usuario.nome, "Usuario de Teste")
        self.assertEqual(usuario.email, "emaildeteste@outlook.com")
        self.assertEqual(usuario.cpf_usuario, cpf)        