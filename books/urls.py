from django.urls import path
from . import views

app_name = "books"

urlpatterns = [
    path("cards/", views.cards_list, name="cards-list"),
    path("cards/<slug:slug>/", views.card_detail, name="cards-detail"),
]
