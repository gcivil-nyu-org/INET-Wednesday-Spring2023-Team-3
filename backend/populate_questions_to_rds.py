import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Hard-coded starter variables
difficulties = ["Easy","Medium","Hard","Expert"]
companies = ["Google", "Amazon", "Meta", "Bloomberg", "Tesla", "Microsoft", "Apple", "Netflix","Slack","Cisco"]
positions = ["Software Engineer 1", "Senior Software Engineer", "Data Scientist", "Business Development Engineer", "Lead Software Engineer"]

# # Script 1 - behavioral questions
import csv
from questions.models import Question
import random

with open("./question_starter_data/Top100Qs.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        _, created = Question.objects.get_or_create(
            title=row[0],
            difficulty=difficulties[random.randint(0,3)],
            type="Behavioural",
            )

# Script 2 - coding questions
import csv
from questions.models import Question

with open("./question_starter_data/leetcode-scraped-problems.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        _, created = Question.objects.get_or_create(
            title=row[1],
            difficulty=row[3],
            description = row[5],
            type="Coding",
            )

# Script 3 - populate companies table
from questions.models import Company
for c in companies:
    Company.objects.get_or_create(name=c)

# Script 4 - populate difficulty table
from questions.models import Difficulty
for d in difficulties:
    Difficulty.objects.get_or_create(text=d)

# Script 5 - populate positions table
from questions.models import Position
for p in positions:
    Position.objects.get_or_create(name=p)

# Script 6 - randomize positions info
from questions.models import Question
import random
questions = Question.objects.filter(type="Coding")
for q in questions:
    cur_num = random.randint(1,3)
    current_picks = random.sample(positions,cur_num)
    q.positions = ",".join(current_picks)
    q.save()

# Script 7 - randomize companies info
from questions.models import Question
import random
questions = Question.objects.all()
for q in questions:
    cur_num = random.randint(1,3)
    current_picks = random.sample(companies,cur_num)
    q.companies = ",".join(current_picks)
    q.save()