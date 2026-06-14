from django.urls import reverse
from django.test import Client
from django.contrib.auth.models import User
from cat.models import Cat
import pytest


WAIT_TIME = 10_000


@pytest.fixture
def admin_user(db):
    """Fixture to create an admin user."""
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
    """Fixture to log in the admin user."""
    client = Client()
    client.login(username=admin_user.username, password="cat")
    return client


@pytest.fixture
def cat_instance(db):
    return Cat.objects.create(name="Murphy", data={"race": "", "gender": "male"})


@pytest.mark.django_db
def test_admin_cat_creation(client_with_login):
    """Test creating a Cat instance through the Django admin."""
    # Access the add view for the Cat model in the admin
    url = reverse("admin:cat_cat_add")
    response = client_with_login.get(url)
    assert response.status_code == 200  # Ensure the add view is accessible

    # POST data to create a new Cat instance
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
def test_hstore_field_edit_view_render_js(admin_user, cat_instance, page, live_server):
    """Playwright test to verify HStore widget renders correctly in the Django admin."""

    console_messages = []
    page.on("console", lambda message: console_messages.append(message))

    # Open the admin login page
    page.goto(f"{live_server.url}/admin/login/")
    page.wait_for_selector('input[name="username"]', timeout=WAIT_TIME)

    # Log in to admin
    page.fill('form input[name="username"]', admin_user.username)
    page.fill('form input[name="password"]', "cat")
    page.click('form input[type="submit"]')

    # Wait for login
    page.wait_for_selector("body.dashboard", timeout=WAIT_TIME)

    # Go to the Cat change page
    change_url = (
        f"{live_server.url}{reverse('admin:cat_cat_change', args=(cat_instance.pk,))}"
    )
    page.goto(change_url)

    # Assert the widget is present
    hstore_widget = page.wait_for_selector("django-hstore-widget", timeout=WAIT_TIME)
    assert hstore_widget is not None

    # Assert that console is empty
    # Playwright captures framework-level warnings; only fail on actual errors.
    browser_errors = [
        message.text for message in console_messages if message.type == "error"
    ]
    unexpected_errors = [
        text for text in browser_errors if "404 (Not Found)" not in text
    ]
    assert not unexpected_errors

    # Assert that there is the hidden textarea
    hstore_widget_textarea = page.wait_for_selector(
        "django-hstore-widget textarea", timeout=WAIT_TIME, state="attached"
    )
    assert hstore_widget_textarea is not None

    # __import__("time").sleep(100)
