# cards/serializers.py
from rest_framework import serializers
from .models import Topic, Card, CardMark

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'question', 'choices', 'correct_index', 'explanation']

class TopicSerializer(serializers.ModelSerializer):
    # include the number of cards or the cards themselves if you want
    cards = CardSerializer(many=True, read_only=True)
    class Meta:
        model = Topic
        fields = ['id', 'title', 'slug', 'cards']

class CardMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardMark
        fields = ['id', 'user_id', 'card', 'created_at']
