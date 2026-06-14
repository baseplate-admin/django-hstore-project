from django import forms


from django_hstore_widget.forms import HStoreFormField

from .models import Cat


class CatForm(forms.ModelForm):
    data = HStoreFormField()

    class Meta:
        model = Cat
        fields = ("name", "data")
