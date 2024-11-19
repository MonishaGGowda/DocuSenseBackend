from django.shortcuts import render
from django.http import HttpResponse

from main.models import MainUser

# Create your views here.
def homepage(request):
    return render(request = request,
                  template_name='main/DataAnalyse/home_page/homepage.html',
                  context={"mainuser":MainUser.objects.all()}
                  )

def viewpage(request):
    return render(request = request,
                  template_name='main/DataAnalyse/view_page/viewpage.html'
                  )

def annotation_page(request):
    analysis_name = request.GET.get('analysis')  
    return render(request, 'main/DataAnalyse/annotation/annotation.html', {
        'analysis': analysis_name
    })

def login_page(request):
    return render(request, 'main/DataAnalyse/login_page/loginpage.html')