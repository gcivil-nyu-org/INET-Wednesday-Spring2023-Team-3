from django.shortcuts import render
from .models import Message
from onboarding.models import MyUser
from django.db.models import Q


# from .models import Message
from rest_framework.views import APIView
from .pusher import pusher_client
from rest_framework.response import Response


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


def get_last_10_messages(author_user, recipient_user):
    # messages = Message.objects.filter(
    #     author=author_user, recipient=recipient_user
    # ).order_by("-timeStamp")
    return []


class MessageAPIView(APIView):
    def post(self, request):
        print(request)

        author_id = request.data["author"]
        recipient_id = request.data["recipient"]

        if author_id < recipient_id:
            room_name = (
                "User_" + str(author_id) + "_Room_" + "User_" + str(recipient_id)
            )
        else:
            room_name = (
                "User_" + str(recipient_id) + "_Room_" + "User_" + str(author_id)
            )

        author_user = MyUser.objects.get(pk=request.data["author"])
        recipient_user = MyUser.objects.get(pk=request.data["recipient"])

        print(author_user)
        pusher_client.trigger(
            room_name,
            "message",
            {
                "username": author_user.first_name + " " + author_user.last_name,
                "message": request.data["message"],
            },
        )

        message = Message.objects.create(
            author=author_user,
            recipient=recipient_user,
            content=request.data["message"],
        )

        print(message)
        return Response([])

    def get(self, request, user_id1, user_id2):
        author_user = MyUser.objects.get(pk=user_id1)
        recipient_user = MyUser.objects.get(pk=user_id2)

        messages = Message.objects.filter(
            (Q(author=author_user) & Q(recipient=recipient_user))
            | (Q(author=recipient_user) & Q(recipient=author_user))
        ).order_by("-timeStamp")

        message_list = []
        for message in messages:
            author_user = MyUser.objects.get(pk=message.author.id)
            message_list.append(
                {
                    "username": author_user.first_name + " " + author_user.last_name,
                    "message": message.content,
                }
            )

        return Response(message_list[::-1])
