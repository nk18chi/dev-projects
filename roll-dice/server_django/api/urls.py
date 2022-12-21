from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    path('roll-dice', views.ListDice.as_view()),
]
