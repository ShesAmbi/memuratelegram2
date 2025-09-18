from django.shortcuts import render
# cards/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Topic, Card, CardMark, Flashcard
from .serializers import TopicSerializer, CardSerializer, CardMarkSerializer

class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

@api_view(['GET'])
def topic_cards(request, pk):
    cards = Card.objects.filter(topic_id=pk).order_by('id')
    serializer = CardSerializer(cards, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def toggle_mark(request):
    """
    Expect JSON: {'user_id': 12345, 'card_id': 7}
    Toggles mark: creates mark if doesn't exist, deletes if exists.
    """
    user_id = request.data.get('user_id')
    card_id = request.data.get('card_id')
    if not user_id or not card_id:
        return Response({'detail': 'user_id and card_id required'}, status=400)
    try:
        card = Card.objects.get(pk=card_id)
    except Card.DoesNotExist:
        return Response({'detail': 'card not found'}, status=404)

    existing = CardMark.objects.filter(user_id=user_id, card=card).first()
    if existing:
        existing.delete()
        return Response({'status': 'unmarked'})
    else:
        mark = CardMark.objects.create(user_id=user_id, card=card)
        return Response({'status': 'marked'})
    
def get_flashcards(request):
    cards = Flashcard.objects.all().values("id", "question", "answer")
    return Response(list(cards))
