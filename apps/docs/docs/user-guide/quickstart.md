# Quick Start

## Using django-hstore-field

```python
# models.py
from django.db import models
from django_hstore_field import HStoreField

class Article(models.Model):
    title = models.CharField(max_length=200)
    tags = HStoreField()
```

The widget is automatically wired to the admin.

## Using django-hstore-widget

```python
# models.py
from django.db import models
from django.contrib.postgres.fields import HStoreField

class Article(models.Model):
    title = models.CharField(max_length=200)
    tags = HStoreField()
```

```python
# forms.py
from django import forms
from django_hstore_widget.forms import HStoreFormField
from .models import Article

class ArticleForm(forms.ModelForm):
    tags = HStoreFormField()

    class Meta:
        model = Article
        fields = '__all__'
```

```python
# admin.py
from django.contrib import admin
from .models import Article
from .forms import ArticleForm

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    form = ArticleForm
```
