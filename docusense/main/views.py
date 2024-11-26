from pyexpat.errors import messages
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from main.forms import AnalysisForm
from main.models import Analysis, MainUser
import json
from django.http import JsonResponse
from django.conf import settings
import os
from django.views.decorators.csrf import csrf_exempt
from .utils import generate_summary
import json
from .models import UploadedDocument
from django.db.models import Q
from .models import Annotation
import google.generativeai as genai
from django.contrib.auth.decorators import login_required

genai.configure(api_key='AIzaSyDK-HUZY-kkLZAW_yjuqeJYASUsC_QKGXw')

def get_uploaded_documents(request):
    documents = UploadedDocument.objects.all().values('id', 'name', 'file', 'upload_time', 'relevancy')
    return JsonResponse(list(documents), safe=False)


@login_required
def search_documents(request):
    search_term = request.GET.get("search", "").strip()

    if not search_term:
        return JsonResponse({"error": "Search term cannot be empty."}, status=400)

    try:
        # Get the base path for uploaded documents
        documents_path = os.path.join('media', 'documents')

        # Filter documents by name or content
        filtered_documents = []
        for document in UploadedDocument.objects.all():
            file_path = os.path.join(documents_path, document.name)
            if os.path.isfile(file_path):
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    if search_term.lower() in content.lower() or search_term.lower() in document.name.lower():
                        filtered_documents.append({
                            "name": document.name,
                            "relevancy": document.relevancy
                        })

        return JsonResponse(filtered_documents, safe=False)

    except Exception as e:
        print(f"Error in search_documents: {e}")
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)

def save_annotation(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            document_name = data.get('document_name')
            annotation_content = data.get('content')
            highlight = data.get("highlight")

            # Ensure required fields are provided
            if not document_name or not annotation_content:
                return JsonResponse({"error": "Missing document_name or content."}, status=400)

            # Fetch the document
            try:
                document = UploadedDocument.objects.get(name=document_name)
            except UploadedDocument.DoesNotExist:
                return JsonResponse({"error": f"Document '{document_name}' not found."}, status=404)

            # Save the annotation
            annotation = Annotation.objects.create(document=document, content=annotation_content)
            return JsonResponse({"message": "Annotation saved successfully.", "id": annotation.id})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
def get_annotations(request):
    document_name = request.GET.get('document_name')  # Get document name from query parameter
    try:
        # Fetch the document by name
        document = UploadedDocument.objects.get(name=document_name)

        # Retrieve annotations specific to this document
        annotations = document.annotations.all().values('id', 'content', 'created_at', 'highlight')

        # Return annotations as a JSON response
        return JsonResponse(list(annotations), safe=False)

    except UploadedDocument.DoesNotExist:
        return JsonResponse({"error": f"Document '{document_name}' not found."}, status=404)

    except Exception as e:
        print(f"Error in get_annotations: {e}")
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)




from main.models import MainUser
@login_required
def annotation_view(request):
    return render(request, 'annotation/annotation.html')

@login_required
def get_documents(request):
    # List all `.txt` files in the `main/documents/` folder
    documents_path = os.path.join(settings.BASE_DIR, "main", "documents")
    documents = [file for file in os.listdir(documents_path) if file.endswith(".txt")]
    return JsonResponse(documents, safe=False)

@login_required
def get_document_content(request):
    document_name = request.GET.get("document")
    
    if not document_name:
        return JsonResponse({"error": "No document specified."}, status=400)

    try:
        # Fetch document from the database
        document = UploadedDocument.objects.get(name=document_name)
        document_path = os.path.join(settings.MEDIA_ROOT, str(document.file))

        # Read the file content
        with open(document_path, "r") as file:
            content = file.read()

        return JsonResponse({"name": document_name, "content": content})
    except UploadedDocument.DoesNotExist:
        return JsonResponse({"error": f"Document '{document_name}' not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

@login_required
def generate_document_summary(request):
    document_name = request.GET.get("document_name")
    all_documents = request.GET.get("all_documents", "false").lower() == "true"

    try:
        if document_name:
            # Fetch the document from the database
            try:
                document = UploadedDocument.objects.get(name=document_name)
            except UploadedDocument.DoesNotExist:
                return JsonResponse({"error": f"Document '{document_name}' not found in the database."}, status=404)

            # Read the content from the database
            content = document.file.read()

            # Generate summary using the Gemini API
            prompt = f"Summarize the following document content:\n\n{content}"
            response = genai.GenerativeModel(model_name="gemini-1.5-flash").generate_content(prompt)
            summary = response.text

            return JsonResponse({"summary": summary})

        elif all_documents:
            # Fetch and concatenate all documents from the database
            all_text = ""
            documents = UploadedDocument.objects.all()
            for document in documents:
                all_text += f"{document.name}:\n{document.file.read()}\n\n"

            # Generate summary for all documents
            prompt = "Based on the following combined documents, identify the main suspect and summarize the case in three lines:\n\n" + all_text
            response = genai.GenerativeModel(model_name="gemini-1.5-flash").generate_content(prompt)
            summary = response.text

            return JsonResponse({"summary": summary})

        else:
            return JsonResponse({"error": "Invalid parameters"}, status=400)

    except Exception as e:
        print(f"Error in generate_document_summary: {e}")
        return JsonResponse({"error": "An unexpected error occurred"}, status=500)

@login_required
def viewpage(request):
    return render(request = request,
                  template_name='main/DataAnalyse/view_page/viewpage.html'
                  )

@login_required
def annotation_page(request):
    analysis_name = request.GET.get('analysis')  
    return render(request, 'main/DataAnalyse/annotation/annotation.html', {
        'analysis': analysis_name
    })

# Create your views here.
@login_required
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
                request.session.save()
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid username or password.'})
        except Exception as e:
            print(f"Error during login: {e}")
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

@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')  # Retrieve the uploaded file
        if not uploaded_file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        # Save the file and metadata
        document = UploadedDocument.objects.create(
            name=uploaded_file.name,
            file=uploaded_file
        )

        return JsonResponse({
            'message': 'File uploaded successfully',
            'file_id': document.id,
            'file_name': document.name,
            'file_url': document.file.url
        })
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def update_annotation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            annotation_id = data.get("id")
            updated_content = data.get("content")

            if not annotation_id or not updated_content:
                return JsonResponse({"error": "Annotation ID and content are required."}, status=400)

            # Fetch and update the annotation
            annotation = Annotation.objects.filter(id=annotation_id).first()
            if not annotation:
                return JsonResponse({"error": "Annotation not found."}, status=404)

            annotation.content = updated_content
            annotation.save()

            return JsonResponse({"message": "Annotation updated successfully."})
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def delete_annotation(request):
    if request.method == "DELETE":
        annotation_id = request.GET.get("id")
        if not annotation_id:
            return JsonResponse({"error": "Annotation ID is required"}, status=400)

        try:
            annotation = Annotation.objects.get(id=annotation_id)
            annotation.delete()  # Delete the annotation
            return JsonResponse({"success": True, "message": "Annotation deleted successfully."})
        except Annotation.DoesNotExist:
            return JsonResponse({"error": "Annotation not found."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def update_relevancy(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            document_name = data.get("document_name")
            new_relevancy = data.get("relevancy")

            document = UploadedDocument.objects.get(name=document_name)
            document.relevancy = new_relevancy
            document.save()

            return JsonResponse({"success": True})
        except UploadedDocument.DoesNotExist:
            return JsonResponse({"error": "Document not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

def get_all_annotations(request):
    try:
        annotations = Annotation.objects.all().select_related('document').values(
            'id',
            'content',
            'highlight',
            'document__name',
            'document__relevancy',
            'created_at'
        )

        # Prepare the response structure
        formatted_annotations = [
            {
                "title": annotation["highlight"] if annotation["highlight"] else annotation["content"],
                "source": annotation["document__name"],
                "sourceLink": f"/annotation/?document={annotation['document__name']}",
                "description": annotation["content"],
                "dateAdded": annotation["created_at"].strftime("%Y-%m-%d"),
                "tags": [annotation["document__relevancy"]],
            }
            for annotation in annotations
        ]

        return JsonResponse(formatted_annotations, safe=False)

    except Exception as e:
        print(f"Error fetching annotations: {e}")
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)