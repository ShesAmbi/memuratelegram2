"""
URL configuration for flashback project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from cards.views import TopicViewSet, topic_cards, toggle_mark
from django.http import HttpResponse
from django.views.generic import TemplateView
from auth_telegram import views as auth_telegram_views


router = DefaultRouter()
router.register(r'topics', TopicViewSet, basename='topic')


def home(request):
    return HttpResponse("Welcome to Flashback API")


urlpatterns = [
    path('', home),  # root path
    path('admin/', admin.site.urls),
    path('api/', include('cards.urls')),
    path('api/topics/<int:pk>/cards/', topic_cards, name='topic-cards'),
    path('api/marks/toggle/', toggle_mark, name='toggle-ma'),
    # Include URLs from your new 'books' app
    path('api/books/', include('books.urls', namespace='books')),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
    path("auth/telegram/", auth_telegram_views.telegram_auth_view, name="telegram-auth"),
    path("api/auth/me/", auth_telegram_views.me_view, name="auth-me"),
]
