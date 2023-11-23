from django.http import HttpResponse
from django.template import loader
from .forms import Model3DForm, Edit3Dfile
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
        if 'upload_file' in request.POST:
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
        elif 'edit_file' in request.POST:
            object_id = request.POST.get('object_id')  # Ambil ID objek yang akan diedit
            edit_file = get_object_or_404(Model3D, id=object_id)
            form_edit = Edit3Dfile(request.POST, instance=edit_file)
            if form_edit.is_valid():
                form_edit.save()
                return redirect('assets')
            else:
                # Jika form tidak valid, atur form menjadi Edit3DFileForm
                form_edit = Edit3Dfile()
    else:
        form = Model3DForm()
        form_edit = Edit3Dfile()

    return render(request, 'assets.html', {'form': form, 'form_edit':form_edit, 'objects': objects})



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


def edit_file3D(request, object_id):
    edit_file = get_object_or_404(Model3D, id=object_id)

    if request.method == 'POST':
        form_edit = Edit3Dfile(request.POST, instance=edit_file)
        if form_edit.is_valid():
            form_edit.save()
            # Update the .glb and .json files
            update_3d_files(edit_file)
            return redirect('assets')
    else:
        form_edit = Edit3Dfile(instance=edit_file)
    return render(request, 'edit_objects.html', {'form_edit': form_edit})

def update_3d_files(model_instance):
    update_glb_file(model_instance)
    update_json_file(model_instance)

def update_glb_file(model_instance):
    old_glb_file_path = os.path.join(settings.MEDIA_ROOT, model_instance.file_3d.name)
    
    # Customize the new filename as needed
    new_glb_filename = f'models/obj/{model_instance.custom_filename}.glb'
    new_glb_file_path = os.path.join(settings.MEDIA_ROOT, new_glb_filename)

    try:
        # Rename the .glb file
        os.rename(old_glb_file_path, new_glb_file_path)

        # Update the model instance with the new .glb filename
        model_instance.file_3d.name = new_glb_filename
        model_instance.save()
    except Exception as e:
        # Handle any exceptions that may occur during the file renaming process
        print(f"Error updating .glb file: {e}")

def update_json_file(model_instance):
    # Update the .json file based on the changes in the model instance
    old_json_file_path = os.path.join(settings.MEDIA_ROOT, model_instance.custom_json_filename)

    # Customize the new filename as needed
    new_json_filename = f'models/obj/{model_instance.custom_filename}.json'
    new_json_file_path = os.path.join(settings.MEDIA_ROOT, new_json_filename)

    try:
        # Rename the .json file
        os.rename(old_json_file_path, new_json_file_path)

        # Update the model instance with the new .json filename
        model_instance.custom_json_filename = new_json_filename
        model_instance.save()
    except Exception as e:
        # Handle any exceptions that may occur during the file renaming process
        print(f"Error updating .json file: {e}")

    if os.path.exists(new_json_file_path):
        # Load existing JSON content
        with open(new_json_file_path, 'r') as json_file:
            json_data = json.load(json_file)

        # Update JSON content with new values
        json_data['size_x'] = model_instance.size_x
        json_data['size_y'] = model_instance.size_y
        json_data['size_z'] = model_instance.size_z
        json_data['custom_filename'] = model_instance.custom_filename

        # Save the updated JSON content
        with open(new_json_file_path, 'w') as updated_json_file:
            json.dump(json_data, updated_json_file)