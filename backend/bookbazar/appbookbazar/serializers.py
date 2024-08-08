from rest_framework import serializers
from appbookbazar.models import *

class Cadastrar_Anuncio_Serializer(serializers.ModelSerializer):

    class Meta:
        model = Anuncio
        fields = [
            'titulo', 'autor', 'editora', 'edicao', 'genero', 'idioma',
            'username', 'valor', 'cidade', 'cep_anuncio', 'latitude',
            'longitude', 'descricao', 'ano_impressao', 'condicao'
        ]

    def create(self, validated_data):
        return super().create(validated_data)
    
class Visualizar_Anuncio_Serializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = Anuncio
        fields = ['id_anuncio', 'titulo', 'autor', 'editora', 'edicao', 'genero', 'idioma', 'username', 'valor', 'cidade', 'descricao', 'ano_impressao', 'condicao']


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
    id_anuncio = serializers.PrimaryKeyRelatedField(queryset=Anuncio.objects.all())
    class Meta:
        model = Comentario
        fields = ['id_anuncio', 'autor', 'texto']

class Avaliacao_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Avaliacao
        fields = []

class Transacao_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transacao
        fields = []                
    

class Mensagem_Serializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(max_length=255)
    receiver_username = serializers.CharField(max_length=255)

    class Meta:
        model = Mensagem
        fields = ['id_mensagem', 'sender_username', 'receiver_username', 'horario_mensagem', 'conteudo_mensagem']

class Credentials_Serializer(serializers.HyperlinkedModelSerializer):
    cpf_usuario = serializers.SlugRelatedField(slug_field='cpf_usuario', queryset=Usuario.objects.all())
    email = serializers.SlugRelatedField(slug_field='email', queryset=Usuario.objects.all())
    class Meta:
        model = Credentials
        fields = ['username', 'senha', 'cpf_usuario', 'email']     

class Perfil_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model: Usuario
        fields = ['nome', 'email']      

class Credentials_Update_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Credentials
        fields = ['username', 'senha', 'email']

class Usuario_Update_Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nome', 'telefone', 'email']                    