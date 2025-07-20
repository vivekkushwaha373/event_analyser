from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.EventSearchView.as_view(), name='event-search'),
] 