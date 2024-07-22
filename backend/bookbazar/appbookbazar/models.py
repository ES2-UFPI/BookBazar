from django.db import models
from geopy.distance import geodesic

class Anuncio(models.Model):
    id_anuncio = models.AutoField(db_column='ID_Anuncio', primary_key=True)
    titulo = models.CharField(db_column='Titulo', max_length=255)
    autor = models.CharField(db_column='Autor', max_length=255)
    editora = models.CharField(db_column='Editora', max_length=255)
    edicao = models.IntegerField(db_column='Edicao', blank=True, null=True)
    genero = models.CharField(db_column='Genero', max_length=255, null=True, blank=True)
    idioma = models.CharField(db_column='Idioma', max_length=255, null=True, blank=True)
    cpf_vendedor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Vendedor', null=True, blank=True)
    valor = models.DecimalField(db_column='Valor', max_digits=10, decimal_places=2)
    cidade = models.CharField(db_column='Cidade', max_length=255, null=True, blank=True)
    cep_anuncio = models.CharField(db_column='CEP_Anuncio', max_length=8)
    latitude = models.DecimalField(db_column='Latitude', max_digits=7, decimal_places=5)
    longitude = models.DecimalField(db_column='Longitude', max_digits=7, decimal_places=5)
    descricao = models.CharField(db_column='Descricao', max_length=1024, null=True, blank=True)
    ano_impressao = models.IntegerField(db_column='Ano_Impressao')
    condicao = models.CharField(db_column='Condicao', max_length=255)

    def calcular_distancia(self, latitude_usuario, longitude_usuario):
        ponto_anuncio = (self.latitude, self.longitude)
        ponto_usuario = (latitude_usuario, longitude_usuario)
        distancia = geodesic(ponto_anuncio, ponto_usuario).meters
        return round(distancia, 2)

    class Meta:
        managed = False
        db_table = 'anuncio'


class Avaliacao(models.Model):
    id_avaliacao = models.AutoField(db_column='ID_Avaliacao', primary_key=True)
    usuario_avaliado = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='Usuario_Avaliado')
    avaliador = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='Avaliador', related_name='avaliacao_avaliador_set')
    estrelas_produto = models.IntegerField(db_column='Estrelas_Produto')
    estrelas_vendedor = models.IntegerField(db_column='Estrelas_Vendedor')
    comentario = models.TextField(db_column='Comentario', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'avaliacao'


class Comentario(models.Model):
    id_comentario = models.AutoField(db_column='ID_Comentario', primary_key=True)
    id_anuncio = models.ForeignKey(Anuncio, models.DO_NOTHING, db_column='ID_Anuncio')
    autor = models.CharField(db_column='Autor', max_length=11)
    texto = models.CharField(db_column='Texto', max_length=1024)

    class Meta:
        managed = False
        db_table = 'comentario'


class Transacao(models.Model):
    id_transacao = models.AutoField(db_column='ID_Transacao', primary_key=True)
    cpf_comprador = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Comprador')
    cpf_vendedor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Vendedor', related_name='transacao_cpf_vendedor_set')
    id_anuncio = models.ForeignKey(Anuncio, models.DO_NOTHING, db_column='ID_Anuncio')

    class Meta:
        managed = False
        db_table = 'transacao'


class Usuario(models.Model):
    cpf_usuario = models.CharField(db_column='CPF_Usuario', primary_key=True, max_length=11)
    nome = models.CharField(db_column='Nome', max_length=255)
    data_nascimento = models.DateField(db_column='Data_nascimento')
    telefone = models.CharField(db_column='Telefone', max_length=13)
    email = models.CharField(db_column='Email', max_length=255)
    senha = models.CharField(db_column='Senha', max_length=32)

    class Meta:
        managed = False
        db_table = 'usuario'