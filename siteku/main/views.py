from django.http import HttpResponse
from django.template import loader
from .forms import UploadObjectForm
from .models import UploadedObjects
from django.shortcuts import render, redirect


def main(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())

def login(request):
    template = loader.get_template('./accounts/login.html')
    return HttpResponse(template.render())

def register(request):
    template = loader.get_template('./accounts/register.html')
    return HttpResponse(template.render())

def gallery(request):
    template = loader.get_template('gallery.html')
    return HttpResponse(template.render())

def assets(request):
    if request.method == 'POST':
        form = UploadObjectForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("view_objects")
    else:
        form = UploadObjectForm()
    return render(request, 'assets.html', {'form': form})

def view_objects(request):
    objects = UploadedObjects.objects.all()
    return render(request, 'view_objects.html', {'objects': objects})
