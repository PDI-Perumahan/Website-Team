# forms.py

from django import forms
from .models import UploadedObjects

class UploadObjectForm(forms.ModelForm):
    class Meta:
        model = UploadedObjects
        fields = ['image']
