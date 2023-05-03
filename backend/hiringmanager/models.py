from django.db import models
from onboarding.models import MyUser


class UserWiseAggregation(models.Model):
    agg_id = models.IntegerField()
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    num_exp_posted = models.IntegerField()
    num_rec_posted = models.IntegerField()
    num_codes_posted = models.IntegerField()
    num_totalcmnts_posted = models.IntegerField()
    num_expcmnts_posted = models.IntegerField()
    num_anscmnts_posted = models.IntegerField()
    avg_rec_rating_received = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Aggregations(models.Model):
    id = models.BigAutoField(primary_key=True)
    last_agg_id = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
