from django.contrib import admin
from .models import Topic, Card, CardMark
# Register your models here.

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ("title",)

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("topic", "question")
    list_filter = ("topic",)

@admin.register(CardMark)
class CardMarkAdmin(admin.ModelAdmin):
    list_display = ("user_id", "card", "created_at")

