# Script 1
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

# Script 2
from nyuapp.models import Question
import random     
companies = ["Google", "Amazon", "Meta", "Bloomberg", "Tesla", "Microsoft", "Apple", "Netflix"]
data = Question.objects.all()
for row in data:
    cur_num = random.randint(1,8)
    current_picks = random.sample(companies,cur_num)
    row.companies = ",".join(current_picks)
    row.save()

# Script 3
from nyuapp.models import Company
companies = ["Google", "Amazon", "Meta", "Bloomberg", "Tesla", "Microsoft", "Apple", "Netflix"]
for c in companies:
    Company.objects.get_or_create(name=c)

# Script 4
from nyuapp.models import Difficulty
diff = ["Easy","Medium","Hard","Expert"]
for d in diff:
    Difficulty.objects.get_or_create(text=d)