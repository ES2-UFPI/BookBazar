from rest_framework import serializers
from appbookbazar.models import *

class Cadastrar_Anuncio_Serializer(serializers.ModelSerializer):

    class Meta:
        model = Anuncio
        fields = [
            'titulo', 'autor', 'editora', 'edicao', 'genero', 'idioma',
            'cpf_vendedor', 'valor', 'cidade', 'cep_anuncio', 'latitude',
            'longitude', 'descricao', 'ano_impressao', 'condicao'
        ]

    def create(self, validated_data):
        return super().create(validated_data)
class Visualizar_Anuncio_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Anuncio
        fields = ['id_anuncio', 'titulo', 'autor', 'editora', 'edicao', 'genero', 'idioma', 'cpf_vendedor', 'valor', 'cidade', 'descricao', 'ano_impressao', 'condicao']

class Pesquisa_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Anuncio
        fields = ['id_anuncio', 'titulo', 'valor', 'latitude', 'longitude'] 

class Usuario_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Usuario
        fields = ['cpf_usuario', 'nome', 'data_nascimento', 'telefone', 'email', 'cep']

class Comentario_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id_comentario', 'id_anuncio', 'autor', 'texto']

class Avaliacao_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Avaliacao
        fields = []

class Transacao_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transacao
        fields = []                
    