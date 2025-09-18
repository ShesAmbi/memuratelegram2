from django.db import models

# Create your models here.

class Topic(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.title

class Card(models.Model):
    topic = models.ForeignKey(Topic, related_name='cards', on_delete=models.CASCADE)
    question = models.TextField()
    # choices stored as list of strings using JSONField (works with SQLite in modern Django)
    choices = models.JSONField()
    # index of correct choice, e.g. 0 for first item
    correct_index = models.IntegerField(default=0)
    explanation = models.TextField(blank=True)

    def __str__(self):
        return f"{self.topic}: {self.question[:40]}"

class CardMark(models.Model):
    # later replace user_id with a ForeignKey to a real User; for now a numeric identifier
    user_id = models.BigIntegerField()
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'card')


class Flashcard(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()

    def __str__(self):
        return self.question


