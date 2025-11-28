from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import logging

logger = logging.getLogger('apps.auth_app')


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Endpoint de login personalizado que retorna token JWT y datos del usuario.
    Compatible con el frontend React.
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            logger.warning("Intento de login sin email o password")
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar usuario por email (username puede ser email)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"Intento de login con email no existente: {email}")
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Autenticar usuario
        user = authenticate(username=user.username, password=password)
        
        if user is None:
            logger.warning(f"Intento de login con contraseña incorrecta para: {email}")
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        logger.info(f"Login exitoso para usuario: {user.email}")
        
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return Response(
            {'error': 'Error al procesar el login'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Endpoint de registro para crear nuevos usuarios normales (no administradores).
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        username = request.data.get('username')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        # Validar campos requeridos
        if not email or not password or not username:
            return Response(
                {'error': 'Email, nombre de usuario y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar formato de email
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {'error': 'El formato del email no es válido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar longitud de contraseña
        if len(password) < 6:
            return Response(
                {'error': 'La contraseña debe tener al menos 6 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el email ya existe
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Ya existe un usuario con este email'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el username ya existe
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Ya existe un usuario con este nombre de usuario'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear usuario normal (NO administrador)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=False,
            is_superuser=False
        )

        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        logger.info(f"Usuario registrado exitosamente: {user.email}")
        
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            },
            'message': 'Usuario registrado exitosamente'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error en registro: {str(e)}")
        return Response(
            {'error': 'Error al procesar el registro'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

