from django.db import models

# Create your models here.
class MainUser(models.Model):
    name = models.TextField()

    def __str__(self):
        return self.name
    
class Analysis(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UploadedDocument(models.Model):
    name = models.CharField(max_length=255)  # File name
    file = models.FileField(upload_to='documents/')  # Path to the file
    upload_time = models.DateTimeField(auto_now_add=True)  # Upload timestamp
    relevancy = models.CharField(max_length=10, choices=[("high", "High"), ("low", "Low")], default="low")

    def __str__(self):
        return self.name

class Annotation(models.Model):
    document = models.ForeignKey(UploadedDocument, on_delete=models.CASCADE, related_name='annotations')
    content = models.TextField()  # The actual annotation text
    created_at = models.DateTimeField(auto_now_add=True)
    highlight = models.TextField(default = "")

    def __str__(self):
        return f"Annotation for {self.document.name}: {self.content[:30]}..."  # First 30 chars