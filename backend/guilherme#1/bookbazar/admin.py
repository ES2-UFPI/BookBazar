from django.contrib import admin
from models import Anuncio, Comentario, Usuario, Avaliacao, Transacao

admin.site.register(Anuncio)
admin.site.register(Usuario)
admin.site.register(Avaliacao)
admin.site.register(Comentario)
admin.site.register(Transacao)
