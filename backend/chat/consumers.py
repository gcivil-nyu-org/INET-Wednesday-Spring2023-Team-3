import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message
from onboarding.models import MyUser
from .views import get_last_10_messages


class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):
        print(data)
        author_user = data['author']
        recipient_user = data['recipient']
        messages = get_last_10_messages(author_user, recipient_user)
        content = {
            'messages': self.messages_to_json(messages)
        }

        print(content)
        self.send_message(content)

    def new_message(self, data):
        print(data)

        author_user = MyUser.objects.get(pk=data['author'])
        recipient_user = MyUser.objects.get(pk=data['recipient'])

        message = Message.objects.create(
            author = author_user, 
            recipient = recipient_user,
            content = data['message']
            )
        
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }

        return self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'author': message.author.pk,
            'recipient': message.recipient.pk,
            'content': message.content,
            'timestamp': str(message.timeStamp)
        }
    
    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, 
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    
    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, 
            {
                "type": "chat_message", 
                "message": message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event["message"]
        self.send(text_data=json.dumps(message))
