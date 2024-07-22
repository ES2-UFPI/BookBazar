from django.urls import re_path
from appbookbazar.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<sender_username>\w+)/(?P<receiver_username>\w+)/$', ChatConsumer.as_asgi()),
]