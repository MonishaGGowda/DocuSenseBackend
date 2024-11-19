from django.contrib import admin
from .models import MainUser
# Register your models here.

class MainUserAdmin(admin.ModelAdmin):
    fields = ["name"]

admin.site.register(MainUser)