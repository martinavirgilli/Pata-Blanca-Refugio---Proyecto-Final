"""
Script para crear un usuario normal (no administrador)
Uso: docker-compose exec web python create_user.py
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'refugio_api.settings')
django.setup()

from django.contrib.auth.models import User

# Configuración del usuario (puedes modificar estos valores)
USERNAME = 'usuario'
EMAIL = 'usuario@refugio.com'
PASSWORD = 'usuario123'  # Cambia esto por una contraseña segura
FIRST_NAME = 'Usuario'
LAST_NAME = 'Normal'

# Verificar si el usuario ya existe
if User.objects.filter(username=USERNAME).exists():
    print(f"El usuario '{USERNAME}' ya existe.")
    user = User.objects.get(username=USERNAME)
    # Asegurarse de que NO sea administrador
    user.is_staff = False
    user.is_superuser = False
    user.save()
    print(f"Usuario '{USERNAME}' actualizado como usuario normal (no administrador).")
else:
    # Crear nuevo usuario normal (NO administrador)
    user = User.objects.create_user(
        username=USERNAME,
        email=EMAIL,
        password=PASSWORD,
        first_name=FIRST_NAME,
        last_name=LAST_NAME,
        is_staff=False,  # NO es staff
        is_superuser=False  # NO es superusuario
    )
    print(f"Usuario normal '{USERNAME}' creado exitosamente.")
    print(f"Email: {EMAIL}")
    print(f"Password: {PASSWORD}")
    print(f"Este usuario NO tiene permisos de administrador.")


