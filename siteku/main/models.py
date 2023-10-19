from django.db import models

# Create your models here.
class UploadedObjects(models.Model):
    image = models.ImageField(upload_to='upload_objects/')