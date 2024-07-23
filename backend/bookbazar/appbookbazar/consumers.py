import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from appbookbazar.models import Mensagem
from datetime import datetime
from django.contrib.sessions.models import Session

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.sender_username = self.scope['url_route']['kwargs']['sender_username']
        self.receiver_username = self.scope['url-route']['kwargs']['receiver_username']

        self.room_name = f"chat_{'_'.join([self.sender_username, self.receiver_username])}"
        self.room_group_name = self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_layer
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["conteudo_mensagem"]
        username = text_data_json["sender_username"]
        horario_mensagem = text_data_json["horario_mensagem"]

        await self.channel_layer.group_send(
            self.roomGroupName,{
                "type": "sendMessage",
                "message": message,
                "username": username,
                "horario_mensagem": horario_mensagem
        })

    async def sendMessage(self, event):
        conteudo_mensagem = event["conteudo_mensagem"]
        sender_username = event["sender_username"]
        receiver_username = event["receiver_username"]
        chat_id = event["chat_id"]
        horario_mensagem = event["horario_mensagem"]

        await self.salvar_mensagem(sender_username, receiver_username, chat_id, horario_mensagem, conteudo_mensagem)

        await self.send(text_data = json.dumps({
            "conteudo_mensagem": conteudo_mensagem,
            "sender_username": sender_username,
            "receiver_username": receiver_username,
            "chat_id": chat_id,
            "horario_mensagem": horario_mensagem
            }))    

    def salvar_mensagem(self, sender_username, receiver_username, chat_id, horario_mensagem, conteudo_mensagem):
        return Mensagem.objects.create(
            sender_username = sender_username,
            receiver_username = receiver_username,
            chat_id = chat_id,
            horario_mensagem = horario_mensagem,
            conteudo_mensagem = conteudo_mensagem
        )