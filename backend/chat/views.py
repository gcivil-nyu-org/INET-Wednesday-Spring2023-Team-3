from django.shortcuts import render, get_object_or_404
from .models import Message

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})

def get_last_10_messages(author_user, recipient_user):
    messages = Message.objects.filter(
        author=author_user, 
        recipient=recipient_user
    ).order_by('-timeStamp')

    return messages