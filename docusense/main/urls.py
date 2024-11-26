from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import update_annotation


app_name = 'main'  # here for namespacing of urls.

urlpatterns = [
    path("home_page/", views.homepage, name="homepage"),
    path("view_page/", views.viewpage, name="view_page"),
    path("annotation/",views.annotationpage, name="annotation_page"),
    path('save_analysis/', views.saveAnalysis, name='save_analysis'),
    path('get_analyses/', views.get_analyses, name='get_analyses'),
    path('get_stannotations/', views.get_stannotations, name='get_stannotations'),
    path('delete_analyses/', views.delete_analyses, name='delete_analyses'),
    path('login_page/',views.loginpage, name="login_page"),
    path('signup_page/',views.signuppage, name="signup_page"),
    path("",views.loginpage, name="login_page"),
    path('annotation/', views.annotation_view, name='annotation'),
    path('api/get-documents/', views.get_documents, name='get_documents'),
    path('api/get-document-content/', views.get_document_content, name='get_document_content'),
    path('api/save-annotation/', views.save_annotation, name='save_annotation'),
    path('api/generate-summary/', views.generate_document_summary, name='generate_summary'),
    path('upload-file/', views.upload_file, name='upload_file'),
    path('api/get-uploaded-documents/', views.get_uploaded_documents, name='get_uploaded_documents'),
    path('api/save-annotation/', views.save_annotation, name='save_annotation'),
    path('api/get-annotations/', views.get_annotations, name='get_annotations'),
    path("api/update-annotation/", update_annotation, name="update_annotation"),
    path('api/delete-annotation/', views.delete_annotation, name='delete_annotation'),
    path("api/update-relevancy/", views.update_relevancy, name="update_relevancy"),
    path("api/search-documents/", views.search_documents, name="search_documents"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
