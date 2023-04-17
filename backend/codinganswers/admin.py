from django.contrib import admin

from .models import QuestionStarterCode, QuestionSubmissionCode

admin.site.register(QuestionStarterCode)
admin.site.register(QuestionSubmissionCode)