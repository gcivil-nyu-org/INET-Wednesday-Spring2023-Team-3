from django.shortcuts import render
# from .models import Message
from rest_framework.views import APIView
from .pusher import pusher_client
from rest_framework.response import Response


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


def get_last_10_messages(author_user, recipient_user):
    messages = Message.objects.filter(
        author=author_user, recipient=recipient_user
    ).order_by("-timeStamp")

    return messages

class MessageAPIView(APIView):
    def post(self, request):
        pusher_client.trigger('chat', 'message', {
            'username': request.data['username'],
            'message': request.data['message'],
            })
        return Response([])

