# models.py
import os
from django.db import models

class Model3D(models.Model):
    name = models.CharField(max_length=255)
    model_obj = models.FileField(upload_to='models/obj/')
    model_json = models.FileField(upload_to='models/json/', blank=True, null=True)

    def delete(self, *args, **kwargs):
        # Jika model memiliki file, hapus file tersebut
        if self.model_obj:
            if os.path.isfile(self.model_obj.path):
                os.remove(self.model_obj.path)
        if self.model_json:  # Jika Anda juga ingin menghapus file json
            if os.path.isfile(self.model_json.path):
                os.remove(self.model_json.path)
        super(Model3D, self).delete(*args, **kwargs)
