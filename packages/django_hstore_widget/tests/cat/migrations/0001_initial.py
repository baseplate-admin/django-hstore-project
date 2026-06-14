# Generated migration file
from django.db import migrations, models
import django.contrib.postgres.fields


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("django_hstore_widget", "__latest__"),
    ]

    operations = [
        migrations.CreateModel(
            name="Cat",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
                ("data", django.contrib.postgres.fields.HStoreField()),
            ],
        ),
    ]
