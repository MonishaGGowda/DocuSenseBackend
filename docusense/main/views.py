from pyexpat.errors import messages
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from main.forms import AnalysisForm
from main.models import Analysis, MainUser
import json

# Create your views here.
def homepage(request):
    return render(request = request,
                  template_name='main/DataAnalyse/home_page/homepage.html',
                  context={"mainuser":MainUser.objects.all()}
                  )

def viewpage(request):
    analyses = Analysis.objects.all()  # Fetch all analyses from the database
    return render(request, 'main/DataAnalyse/view_page/viewpage.html', {'analyses': analyses})

def annotationpage(request):
    analysis_name = request.GET.get('analysis')  
    return render(request, 'main/DataAnalyse/annotation/annotation.html', {
        'analysis': analysis_name
    })

@csrf_exempt
def loginpage(request):
    # if request.method == 'POST':
    #     username = request.POST.get('username')
    #     password = request.POST.get('password')
    #     user = authenticate(request, username=username, password=password)
    #     if user:
    #         login(request, user)
    #         return redirect('homepage')  # Redirect to the homepage
    #     else:
    #         messages.error(request, 'Invalid username or password.')
    # return render(request, 'main/DataAnalyse/login_page/loginpage.html')
    if request.method == 'GET':
        return render(request, 'main/DataAnalyse/login_page/loginpage.html')
    if request.method == 'POST':
        try:
            # Process login
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid username or password.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

@csrf_exempt
def signuppage(request):
    # if request.method == 'POST':
    #     username = request.POST.get('username')
    #     email = request.POST.get('email')
    #     password = request.POST.get('password')
        
    #     if User.objects.filter(username=username).exists():
    #         messages.error(request, 'Username already taken.')
    #     elif User.objects.filter(email=email).exists():
    #         messages.error(request, 'Email already registered.')
    #     else:
    #         User.objects.create_user(username=username, email=email, password=password)
    #         messages.success(request, 'Account created successfully! Please log in.')
    #         return redirect('homepage')
    # return render(request, 'main/DataAnalyse/login_page/loginpage.html')
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Username already taken.'})
            elif User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email already registered.'})

            User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'success': True, 'message': 'User registered successfully!'})

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

def create_analysis(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            description = data.get('description')
            if name and description:
                AnalysisForm.objects.create(name=name, description=description)
                return JsonResponse({'success': True, 'message': 'Analysis saved successfully!'})
            else:
                return JsonResponse({'success': False, 'message': 'Both name and description are required.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

@csrf_exempt
def saveAnalysis(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            description = data.get('description')
            if name and description:
                Analysis.objects.create(name=name, description=description)
                return JsonResponse({'success': True, 'message': 'Analysis saved successfully!'})
            else:
                return JsonResponse({'success': False, 'message': 'Both name and description are required.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


def get_analyses(request):
    analyses = Analysis.objects.all().values('name', 'description')
    return JsonResponse({'analyses': list(analyses)})

def get_stannotations(request):
    return render(request, 'main/DataAnalyse/stored-annotations/stored_annotations.html')

@csrf_exempt
def delete_analyses(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            names = data.get('names', []) 
            if not names:
                return JsonResponse({'success': False, 'message': 'No items to delete.'})
            deleted_count, _ = Analysis.objects.filter(name__in=names).delete()
            
            if deleted_count > 0:
                return JsonResponse({'success': True, 'message': f'{deleted_count} items deleted successfully.'})
            else:
                return JsonResponse({'success': False, 'message': 'No matching items found to delete.'})

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'})
    



    # if request.method == 'POST':
    #     try:
    #         data = json.loads(request.body)
    #         ids = data.get('ids', [])
    #         if not ids:
    #             return JsonResponse({'success': False, 'message': 'No items to delete.'})

    #         # Delete the selected analyses from the database
    #         Analysis.objects.filter(id__in=ids).delete()
    #         return JsonResponse({'success': True, 'message': 'Selected items deleted successfully.'})
    #     except Exception as e:
    #         return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})
    # else:
    #     return JsonResponse({'success': False, 'message': 'Invalid request method.'})