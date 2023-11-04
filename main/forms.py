# forms.py
from django import forms
from .models import Model3D

class Model3DForm(forms.ModelForm):
    class Meta:
        model = Model3D
        fields = ['model_obj']
