from django.http import HttpResponse
from django.template import loader
from .forms import Model3DForm
from .models import Model3D
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect
from django.core.files import File
from django.conf import settings

import json
import os

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
    json_files = []

    directory = os.path.join(settings.MEDIA_ROOT, '3d-env')

    # Loop melalui semua file di direktori
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            json_files.append(filename)
    return render(request, 'gallery.html', {'json_files': json_files})

def assets(request):
    objects = Model3D.objects.all()

    if request.method == 'POST':
        form = Model3DForm(request.POST, request.FILES)
        if form.is_valid():
            model_3d = form.save(commit=False)

            # Set the custom filename
            custom_filename = form.cleaned_data.get('custom_filename')
            model_3d.custom_filename = custom_filename

            # Set the JSON filename using MEDIA_ROOT
            json_filename = f'{custom_filename}.json'
            model_3d.custom_json_filename = os.path.join('models/obj', json_filename)
            

            # Create a dictionary with relevant data for JSON representation
            json_data = {
                'custom_filename': model_3d.custom_filename,
                'size_x': model_3d.size_x,
                'size_y': model_3d.size_y,
                'size_z': model_3d.size_z,
            }

            # Save the JSON data to a file
            with open(os.path.join(settings.MEDIA_ROOT, 'models/obj', json_filename), 'w') as json_file:
                json.dump(json_data, json_file, indent=2)

            model_3d.save()

            return redirect('assets')  # Replace with your actual redirect URL
    else:
        form = Model3DForm()

    return render(request, 'assets.html', {'form': form, 'objects': objects})



def view_result(request, object_id):
    # Mengambil objek berdasarkan ID
    obj_3d = get_object_or_404(Model3D, pk=object_id)
    # Menyediakan path file objek 3D ke template
    return render(request, 'view_objects.html', {'obj_3d': obj_3d})

def delete_object(request, object_id):
    model_object = get_object_or_404(Model3D, pk=object_id)

    # Hapus objek dari database
    model_object.delete()

    return redirect('assets')  # Gantikan dengan URL tujuan Anda setelah menghapus objek.

def view_3d_env(request, filename):
    return render(request, 'view_3d_env.html', {'filename': filename})
