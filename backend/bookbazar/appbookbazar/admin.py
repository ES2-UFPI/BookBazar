from django.contrib import admin
from . import models


admin.site.register(models.Anuncio)
admin.site.register(models.Avaliacao)
admin.site.register(models.Usuario)
admin.site.register(models.Transacao)
admin.site.register(models.Comentario)
admin.site.register(models.Mensagem)
admin.site.register(models.Credentials)
