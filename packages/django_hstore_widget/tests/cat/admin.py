from django.contrib import admin

from .models import Cat
from .forms import CatForm


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    form = CatForm
