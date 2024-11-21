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