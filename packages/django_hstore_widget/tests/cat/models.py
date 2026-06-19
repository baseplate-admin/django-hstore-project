from django.contrib.postgres.fields import HStoreField
from django.db import models


class Cat(models.Model):
    name = models.CharField(max_length=32)
    data = HStoreField()
