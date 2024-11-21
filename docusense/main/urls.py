from django.urls import path
from . import views


app_name = 'main'  # here for namespacing of urls.

urlpatterns = [
    path("home_page/", views.homepage, name="homepage"),
    path("view_page/", views.viewpage, name="view_page"),
    path("annotation/",views.annotationpage, name="annotation_page"),
    path('save_analysis/', views.saveAnalysis, name='save_analysis'),
    path('get_analyses/', views.get_analyses, name='get_analyses'),
    path('get_stannotations/', views.get_stannotations, name='get_stannotations'),
    path('delete_analyses/', views.delete_analyses, name='delete_analyses'),
    path("login_page/",views.loginpage, name="login_page"),
    path("",views.loginpage, name="login_page")
]