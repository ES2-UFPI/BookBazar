# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Anuncio(models.Model):
    id_anuncio = models.AutoField(db_column='ID_Anuncio', primary_key=True)  # Field name made lowercase.
    titulo = models.CharField(db_column='Titulo', max_length=255)  # Field name made lowercase.
    autor = models.CharField(db_column='Autor', max_length=255)  # Field name made lowercase.
    editora = models.CharField(db_column='Editora', max_length=255)  # Field name made lowercase.
    edicao = models.IntegerField(db_column='Edicao', blank=True, null=True)  # Field name made lowercase.
    genero = models.CharField(db_column='Genero', max_length=255, null=True, blank=True)  # Field name made lowercase.
    idioma = models.CharField(db_column='Idioma', max_length=255, null=True, blank=True)  # Field name made lowercase.
    cpf_vendedor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Vendedor', null=True, blank=True)  # Field name made lowercase.
    valor = models.DecimalField(db_column='Valor', max_digits=10, decimal_places=2)  # Field name made lowercase.
    cidade = models.CharField(db_column='Cidade', max_length=255, null=True, blank=True)  # Field name made lowercase.
    cep_anuncio = models.CharField(db_column='CEP_Anuncio', max_length=8)  # Field name made lowercase.
    latitude = models.DecimalField(db_column='Latitude', max_digits=7, decimal_places=5)  # Field name made lowercase.
    longitude = models.DecimalField(db_column='Longitude', max_digits=7, decimal_places=5)  # Field name made lowercase.
    descricao = models.CharField(db_column='Descricao', max_length=1024, null=True, blank=True)  # Field name made lowercase.
    ano_impressao = models.IntegerField(db_column='Ano_Impressao')  # Field name made lowercase.
    condicao = models.CharField(db_column='Condicao', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'anuncio'


class Avaliacao(models.Model):
    id_avaliacao = models.AutoField(db_column='ID_Avaliacao', primary_key=True)  # Field name made lowercase.
    usuario_avaliado = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='Usuario_Avaliado')  # Field name made lowercase.
    avaliador = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='Avaliador', related_name='avaliacao_avaliador_set')  # Field name made lowercase.
    estrelas_produto = models.IntegerField(db_column='Estrelas_Produto')  # Field name made lowercase.
    estrelas_vendedor = models.IntegerField(db_column='Estrelas_Vendedor')  # Field name made lowercase.
    comentario = models.TextField(db_column='Comentario', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'avaliacao'


class Comentario(models.Model):
    id_comentario = models.AutoField(db_column='ID_Comentario', primary_key=True)  # Field name made lowercase.
    id_anuncio = models.ForeignKey(Anuncio, models.DO_NOTHING, db_column='ID_Anuncio')  # Field name made lowercase.
    autor = models.CharField(db_column='Autor', max_length=11)  # Field name made lowercase.
    texto = models.CharField(db_column='Texto', max_length=1024)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'comentario'


class Transacao(models.Model):
    id_transacao = models.AutoField(db_column='ID_Transacao', primary_key=True)  # Field name made lowercase.
    cpf_comprador = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Comprador')  # Field name made lowercase.
    cpf_vendedor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Vendedor', related_name='transacao_cpf_vendedor_set')  # Field name made lowercase.
    id_anuncio = models.ForeignKey(Anuncio, models.DO_NOTHING, db_column='ID_Anuncio')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'transacao'


class Usuario(models.Model):
    cpf_usuario = models.CharField(db_column='CPF_Usuario', primary_key=True, max_length=11)  # Field name made lowercase.
    nome = models.CharField(db_column='Nome', max_length=255)  # Field name made lowercase.
    data_nascimento = models.DateField(db_column='Data_nascimento')  # Field name made lowercase.
    telefone = models.CharField(db_column='Telefone', max_length=13)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=255)  # Field name made lowercase.
    cep = models.CharField(db_column='CEP', max_length=8)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'usuario'
