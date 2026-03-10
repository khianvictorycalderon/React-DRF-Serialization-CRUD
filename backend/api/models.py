import uuid
from django.db import models

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    age = models.PositiveBigIntegerField()
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name