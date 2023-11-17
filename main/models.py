# models.py
import os
from django.db import models
from django.conf import settings
def custom_upload_to(instance, filename):

    # Customize the filename as needed
    base_filename, file_extension = os.path.splitext(filename)
    return f'models/obj/{instance.custom_filename}{file_extension}'

class Model3D(models.Model):
    file_3d = models.FileField(upload_to=custom_upload_to)
    size_x = models.FloatField()
    size_y = models.FloatField()
    size_z = models.FloatField()
    custom_filename = models.CharField(max_length=255, blank=True, null=True)
    custom_json_filename = models.CharField(max_length=255, blank=True, null=True)
    

    def delete(self, *args, **kwargs):
        # Delete the .glb file
        if self.file_3d:
            self.file_3d.delete(save=False)
        
        # Delete the .json file
        json_file_path = os.path.join(settings.MEDIA_ROOT, self.custom_json_filename)
        print(json_file_path)
        if os.path.isfile(json_file_path):
            os.remove(json_file_path)

        super(Model3D, self).delete(*args, **kwargs)  # Call the "real" delete() method.
