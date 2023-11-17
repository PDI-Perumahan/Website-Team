from django.urls import path

from . import views

urlpatterns = [
    path("home", views.main, name="home"),
    path("accounts/login", views.login, name="login"),
    path("accounts/register", views.register, name="register"),
    path("gallery", views.gallery, name="gallery"),
    path("assets", views.assets, name="assets"),
    path("view/<int:object_id>/",views.view_result, name="view"),
    path('delete_object/<int:object_id>/', views.delete_object, name='delete_object'),

]