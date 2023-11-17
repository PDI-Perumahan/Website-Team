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
    template = loader.get_template('gallery.html')
    return HttpResponse(template.render())

def assets(request):
    objects = Model3D.objects.all()

    if request.method == 'POST':
        form = Model3DForm(request.POST, request.FILES)
        if form.is_valid():
            model_3d = form.save(commit=False)

            # Set the custom filename
            custom_filename = form.cleaned_data.get('custom_filename')
            model_3d.custom_filename = custom_filename

            # # Set the GLB filename using MEDIA_ROOT
            # glb_filename = f'{custom_filename}.glb'
            # model_3d.file_3d.name = glb_filename
            # print("atas" + model_3d.file_3d.name)

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
            # print(" bawah" + os.path.join(settings.MEDIA_ROOT, 'models/obj', glb_filename))

            # Save the GLB file
            # with open(os.path.join(settings.MEDIA_ROOT, 'models/obj', glb_filename), 'wb') as glb_file:
            #     for chunk in model_3d.file_3d.chunks():
            #         glb_file.write(chunk)

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
