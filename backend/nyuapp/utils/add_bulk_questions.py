od = ["Easy","Medium","Hard","Expert"]
import csv
from nyuapp.models import Question
import random

with open("<path_to_csv>") as f:
    reader = csv.reader(f)
    for row in reader:
        _, created = Question.objects.get_or_create(
            title=row[0],
            difficulty=od[random.randint(0,3)],
            type="Behavioural",
            )