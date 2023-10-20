from django.urls import path

from . import views

urlpatterns = [
    path("home", views.main, name="home"),
    path("accounts/login", views.login, name="login"),
    path("accounts/register", views.register, name="register"),
    path("gallery", views.gallery, name="gallery"),
    path("assets", views.assets, name="assets"),
    path('view/', views.view_objects, name='view_objects'),
]