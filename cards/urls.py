from django.urls import path
from .views import get_flashcards

urlpatterns = [
    path('flashcards/', get_flashcards),
]
