from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Anuncio, Usuario, Comentario, Avaliacao, Transacao

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

class Visualizar_Anuncio_Serializer(serializers.ModelSerializer):
    distancia_usuario = serializers.SerializerMethodField()

    class Meta:
        model = Anuncio
        fields = [
            'id_anuncio', 'titulo', 'autor', 'editora', 'edicao', 'genero', 'idioma',
            'cpf_vendedor', 'valor', 'cidade', 'descricao', 'ano_impressao',
            'condicao', 'distancia_usuario'
        ]

    def get_distancia_usuario(self, obj):
        latitude_usuario = self.context.get('latitude_usuario')
        longitude_usuario = self.context.get('longitude_usuario')
        if latitude_usuario and longitude_usuario:
            return obj.calcular_distancia(latitude_usuario, longitude_usuario)
        return None

class Pesquisa_Serializer(serializers.ModelSerializer):
    distancia = serializers.SerializerMethodField()

    class Meta:
        model = Anuncio
        fields = ['id_anuncio', 'titulo', 'valor', 'latitude', 'longitude', 'distancia']

    def get_distancia(self, obj):
        request = self.context.get('request')
        if request:
            latitude_usuario = float(request.query_params.get('latitude_usuario', 0))
            longitude_usuario = float(request.query_params.get('longitude_usuario', 0))
            #print(f"Latitude do usuário: {latitude_usuario}, Longitude do usuário: {longitude_usuario}")
            distancia = obj.calcular_distancia(latitude_usuario, longitude_usuario)
            #print(f"Distância calculada: {distancia}")
            return distancia
        return None

class Usuario_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['cpf_usuario', 'nome', 'data_nascimento', 'telefone', 'email', 'senha']

        def create(self, validated_data):
        # Hash da senha antes de salvar
            validated_data['senha'] = make_password(validated_data['senha'])
            return super().create(validated_data)

class Comentario_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id_comentario', 'id_anuncio', 'autor', 'texto']

class Avaliacao_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = ['id_avaliacao', 'usuario_avaliado', 'avaliador', 'estrelas_produto', 'estrelas_vendedor', 'comentario']

class Transacao_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Transacao
        fields = ['id_transacao', 'cpf_comprador', 'cpf_vendedor', 'id_anuncio']
