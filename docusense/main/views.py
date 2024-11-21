from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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

def loginpage(request):
    return render(request, 'main/DataAnalyse/login_page/loginpage.html')

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