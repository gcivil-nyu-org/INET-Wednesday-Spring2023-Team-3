from rest_framework import viewsets, parsers
from .models import DropBox
from .serializers import DropBoxSerializer
from django.http import JsonResponse
from django.core import serializers
import json
class DropBoxViewset(viewsets.ModelViewSet):
 
    queryset = DropBox.objects.all()
    serializer_class = DropBoxSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    http_method_names = ['get', 'post', 'patch', 'delete']

def list_answers_for_ques(request,q_id):
    response_dict = {}
    answers = DropBox.objects.filter(question=q_id)

    response_dict["answer_data"] = json.loads(
            serializers.serialize("json", answers)
        )
    
    response_dict["error_msg"] = ""
    response_dict["status_code"] = 200

    return JsonResponse(response_dict)
    
