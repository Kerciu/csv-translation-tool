# Generated by Django 5.1.8 on 2025-04-27 09:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0002_customcontenttype_customgroup_customlogentry_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customgroup',
            name='group_ptr',
        ),
        migrations.RemoveField(
            model_name='customlogentry',
            name='logentry_ptr',
        ),
        migrations.RemoveField(
            model_name='custompermission',
            name='permission_ptr',
        ),
        migrations.RemoveField(
            model_name='user',
            name='groups',
        ),
        migrations.RemoveField(
            model_name='user',
            name='user_permissions',
        ),
        migrations.DeleteModel(
            name='CustomContentType',
        ),
        migrations.DeleteModel(
            name='CustomGroup',
        ),
        migrations.DeleteModel(
            name='CustomLogEntry',
        ),
        migrations.DeleteModel(
            name='CustomPermission',
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]
