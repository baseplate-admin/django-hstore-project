from django.contrib import admin

from .forms import CatForm
from .models import Cat


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    form = CatForm
