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
    distancia_usuario = serializers.SerializerMethodField
    class Meta:
        model = Anuncio
        fields = ['id_anuncio', 'titulo', 'autor', 'editora', 'edicao', 'genero', 'idioma', 'cpf_vendedor', 'valor', 'cidade', 'descricao', 'ano_impressao', 'condicao', 'distancia_usuario']

    def get_distancia_usuario(self, obj):
        latitude_usuario = self.context.get('latitude_usuario')
        longitude_usuario = self.context.get('longitude_usuario')
        if latitude_usuario and longitude_usuario:
            return obj.calcular_distancia(latitude_usuario, longitude_usuario)
        
        return None    

class Pesquisa_Serializer(serializers.HyperlinkedModelSerializer):
    distancia = serializers.SerializerMethodField()
    class Meta:
        model = Anuncio
        fields = ['id_anuncio', 'titulo', 'valor', 'latitude', 'longitude', 'distancia']

    def get_distancia(self, obj):
        request = self.context.get('request')
        if request:
            latitude_usuario = float(request.query_params.get('latitude_usuario', 0))
            longitude_usuario = float(request.query_params.get('longitude_usuario', 0))

            distancia = obj.calcular_distancia(latitude_usuario, longitude_usuario)

            return distancia
        return None     

class Usuario_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Usuario
        fields = ['cpf_usuario', 'nome', 'data_nascimento', 'telefone', 'email']

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
    
class Mensagem_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Mensagem
        fields = ['cpf_remetente', 'cpf_destinatario', 'chat_id', 'horario_mensagem', 'conteudo_mensagem']    

class Credentials_Serializer(serializers.HyperlinkedModelSerializer):
    cpf_usuario = serializers.SlugRelatedField(slug_field='cpf_usuario', queryset=Usuario.objects.all())
    email = serializers.SlugRelatedField(slug_field='email', queryset=Usuario.objects.all())
    class Meta:
        model = Credentials
        fields = ['username', 'senha', 'cpf_usuario', 'email']     

class Perfil_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model: Usuario
        fields = ['Nome', 'email']           