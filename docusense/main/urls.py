from django.urls import path
from . import views


app_name = 'main'  # here for namespacing of urls.

urlpatterns = [
    path("home_page/", views.homepage, name="homepage"),
    path("view_page/", views.viewpage, name="view_page"),
    path("annotation/",views.annotation_page, name="annotation_page"),
    path("",views.login_page, name="login_page")
]