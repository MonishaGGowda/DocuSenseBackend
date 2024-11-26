from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.db import models

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        def create_superuser(sender, **kwargs):
            from django.contrib.auth.models import User
            if not User.objects.filter(is_superuser=True).exists():
                User.objects.create_superuser('admin', 'admin@example.com', 'admin')
        post_migrate.connect(create_superuser)