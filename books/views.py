from django.http import JsonResponse, Http404
from .models import BookCard

def cards_list(request):
    """
    GET /api/books/cards/  -> returns list of cards
    """
    qs = BookCard.objects.all().order_by("order", "created_at")
    data = [
        {
            "id": card.slug,
            "title": card.title,
            "image": card.image,
        }
        for card in qs
    ]
    return JsonResponse(data, safe=False)

def card_detail(request, slug):
    """
    GET /api/books/cards/<slug>/ -> returns single card object
    """
    try:
        card = BookCard.objects.get(slug=slug)
    except BookCard.DoesNotExist:
        raise Http404("Card not found")
    data = {
        "id": card.slug,
        "title": card.title,
        "image": card.image,
    }
    return JsonResponse(data)
