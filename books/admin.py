from django.contrib import admin
from .models import BookCard

@admin.register(BookCard)
class BookCardAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "created_at")
    search_fields = ("title", "slug")
    ordering = ("order", "-created_at")
