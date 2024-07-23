# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from geopy.distance import geodesic


class Anuncio(models.Model):
    id_anuncio = models.AutoField(db_column='ID_Anuncio', primary_key=True)  # Field name made lowercase.
    titulo = models.CharField(db_column='Titulo', max_length=255)  # Field name made lowercase.
    autor = models.CharField(db_column='Autor', max_length=255)  # Field name made lowercase.
    editora = models.CharField(db_column='Editora', max_length=255)  # Field name made lowercase.
    edicao = models.IntegerField(db_column='Edicao')  # Field name made lowercase.
    genero = models.CharField(db_column='Genero', max_length=255)  # Field name made lowercase.
    idioma = models.CharField(db_column='Idioma', max_length=255)  # Field name made lowercase.
    cpf_vendedor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='CPF_Vendedor')  # Field name made lowercase.
    valor = models.DecimalField(db_column='Valor', max_digits=10, decimal_places=0)  # Field name made lowercase.
    cidade = models.CharField(db_column='Cidade', max_length=255)  # Field name made lowercase.
    cep_anuncio = models.CharField(db_column='CEP_Anuncio', max_length=8)  # Field name made lowercase.
    latitude = models.DecimalField(db_column='Latitude', max_digits=7, decimal_places=5)  # Field name made lowercase.
    longitude = models.DecimalField(db_column='Longitude', max_digits=7, decimal_places=5)  # Field name made lowercase.
    descricao = models.CharField(db_column='Descricao', max_length=1024)  # Field name made lowercase.
    ano_impressao = models.IntegerField(db_column='Ano_Impressao')  # Field name made lowercase.
    condicao = models.CharField(db_column='Condicao', max_length=255)  # Field name made lowercase.

    def calcular_distancia(self, latitude_usuario, longitude_usuario):
        ponto_anuncio = (self.latitude, self.longitude)
        ponto_usuario = (latitude_usuario, longitude_usuario)
        distancia = geodesic(ponto_anuncio, ponto_usuario).meters
        return round(distancia, 2)

    class Meta:
        managed = False
        db_table = 'anuncio'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


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
    autor = models.CharField(db_column='Autor', max_length=155)  # Field name made lowercase.
    texto = models.CharField(db_column='Texto', max_length=1024)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'comentario'


class Credentials(models.Model):
    username = models.CharField(primary_key=True, max_length=155)
    senha = models.CharField(max_length=18)
    cpf_usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='cpf_usuario')
    email = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='email', to_field='email', related_name='credentials_email_set')

    class Meta:
        managed = False
        db_table = 'credentials'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Mensagem(models.Model):
    id_mensagem = models.AutoField(primary_key=True)
    sender_username = models.ForeignKey(Credentials, models.DO_NOTHING, db_column='sender_username')
    receiver_username = models.ForeignKey(Credentials, models.DO_NOTHING, db_column='receiver_username', related_name='mensagem_receiver_username_set')
    chat_id = models.IntegerField()
    horario_mensagem = models.DateTimeField()
    conteudo_mensagem = models.TextField()

    class Meta:
        managed = False
        db_table = 'mensagem'


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
    email = models.CharField(db_column='Email', unique=True, max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'usuario'
