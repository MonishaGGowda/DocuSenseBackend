from django.urls import path
from . import views


app_name = 'main'  # here for namespacing of urls.

urlpatterns = [
    path("", views.homepage, name="homepage"),
    path("view_page/", views.viewpage, name="view_page"),
    path("annotation/",views.annotation_page, name="annotation_page")
]