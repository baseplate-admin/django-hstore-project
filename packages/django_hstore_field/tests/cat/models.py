from django.db import models

from django_hstore_field import HStoreField


class Cat(models.Model):
    name = models.CharField(max_length=32)
    data = HStoreField()
