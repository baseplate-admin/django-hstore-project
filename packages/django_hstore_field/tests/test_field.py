from django.urls import reverse
from django.test import Client
from django.contrib.auth.models import User
from cat.models import Cat
import pytest


WAIT_TIME = 10_000


@pytest.fixture
def admin_user(db):
    user = User.objects.create(
        username="murphy",
        is_staff=True,
        is_superuser=True,
        is_active=True,
    )
    user.set_password("cat")
    user.save()
    return user


@pytest.fixture
def client_with_login(admin_user):
    client = Client()
    client.login(username=admin_user.username, password="cat")
    return client


@pytest.fixture
def cat_instance(db):
    return Cat.objects.create(name="Murphy", data={"race": "", "gender": "male"})


@pytest.mark.django_db
def test_admin_cat_creation(client_with_login):
    url = reverse("admin:cat_cat_add")
    response = client_with_login.get(url)
    assert response.status_code == 200

    data = {
        "name": "Whiskers",
        "data": '{"race": "Siamese", "gender": "female"}',
    }
    response = client_with_login.post(url, data, follow=True)


@pytest.mark.django_db
def test_hstore_field_edit_view_render_no_js(client_with_login):
    cat = Cat.objects.create(name="Murphy", data={"race": "", "gender": "male"})
    url = reverse("admin:cat_cat_change", args=(cat.pk,))
    response = client_with_login.get(url)

    assert response.status_code == 200
    assert "django-hstore-widget" in response.content.decode()


@pytest.mark.django_db
def test_field_uses_correct_widget(client_with_login):
    from django_hstore_widget.forms import HStoreFormField
    from django_hstore_widget.widgets import HStoreFormWidget

    from django_hstore_field import HStoreField

    field = HStoreField()
    form_field = field.formfield()

    assert isinstance(form_field, HStoreFormField)
    assert form_field.widget.__class__ == HStoreFormWidget
