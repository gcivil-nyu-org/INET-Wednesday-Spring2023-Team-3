from django.contrib import admin

from .models import UserWiseAggregation, Aggregations

admin.site.register(UserWiseAggregation)
admin.site.register(Aggregations)
