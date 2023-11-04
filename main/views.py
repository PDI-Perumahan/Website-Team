from django.http import HttpResponse
from django.template import loader
from .forms import Model3DForm
from .models import Model3D
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect
from django.core.files import File

import json
from django.http import JsonResponse
import os
import subprocess

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
            model = form.save(commit=False)
            model.save()

            if model.model_obj:
                obj_path = model.model_obj.path
                json_path = obj_path.replace('.obj', '.json')
                convert_obj_to_json(obj_path, json_path)
                # conversion_result = convert_obj_to_json(obj_path, json_path)

                # if conversion_result.get('status') == 'success':
                #     # Simpan path JSON ke model Model3D jika diperlukan
                #     model.json_path = conversion_result.get('json_path')

                #     # Simpan file JSON hasil konversi
                #     with open(json_path, 'rb') as json_file:
                #         model.json_file.save('nama_file.json', File(json_file))

                #     model.save()
                # else:
                #     # Tangani kesalahan jika ada kesalahan dalam konversi
                #     return HttpResponse('Error during conversion: ' + conversion_result.get('message'), status=500)


            return redirect('assets')  # Gantikan dengan URL tujuan Anda setelah berhasil mengunggah.
    else:
        form = Model3DForm()
    return render(request, 'assets.html', {'form': form, 'objects': objects})

def convert_obj_to_json(obj_path, json_path):
    cmd = ['node', 'main/scripts/convert_obj_to_json.js', obj_path, json_path]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        # Tangani kesalahan jika ada kesalahan dalam proses konversi
        # Misalnya, tampilkan pesan kesalahan atau lakukan tindakan lain yang sesuai
        print(f"Error during conversion: {e}")

# def convert_obj_to_json(obj_path, json_path):
#     try:
#         # Ganti perintah berikut sesuai dengan cara Anda menjalankan skrip JavaScript yang mengonversi OBJ ke JSON
#         cmd = ['node', 'main/scripts/convert_obj_to_json.js', obj_path, json_path]

#         # Jalankan perintah konversi
#         subprocess.run(cmd, check=True)

#         return {'status': 'success', 'json_path': json_path}
#     except subprocess.CalledProcessError as e:
#         # Tangani kesalahan jika ada kesalahan dalam proses konversi
#         error_message = f"Error during conversion: {e}"
#         return {'status': 'error', 'message': error_message}



def view_result(request, object_id):
    # Mengambil objek berdasarkan ID
    obj_3d = get_object_or_404(Model3D, pk=object_id)
    # Menyediakan path file objek 3D ke template
    return render(request, 'view_objects.html', {'obj_3d': obj_3d})

def delete_object(request, pk):
    obj = get_object_or_404(Model3D, pk=pk)
    obj.delete()
    return redirect('assets')  # Gantikan dengan URL tujuan Anda setelah menghapus objek.
