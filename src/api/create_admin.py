"""
Script para crear un usuario administrador
Uso: docker-compose exec web python create_admin.py
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'refugio_api.settings')
django.setup()

from django.contrib.auth.models import User

# Configuración del usuario admin
USERNAME = 'admin'
EMAIL = 'admin@refugio.com'
PASSWORD = 'admin123'  # Cambia esto por una contraseña segura

# Verificar si el usuario ya existe
if User.objects.filter(username=USERNAME).exists():
    print(f"El usuario '{USERNAME}' ya existe.")
    user = User.objects.get(username=USERNAME)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"Usuario '{USERNAME}' actualizado como administrador.")
else:
    # Crear nuevo usuario admin
    user = User.objects.create_superuser(
        username=USERNAME,
        email=EMAIL,
        password=PASSWORD
    )
    print(f"Usuario administrador '{USERNAME}' creado exitosamente.")
    print(f"Email: {EMAIL}")
    print(f"Password: {PASSWORD}")

