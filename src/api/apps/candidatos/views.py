from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
import logging

from .models import Candidato
from .serializers import CandidatoSerializer

logger = logging.getLogger('apps.candidatos')


class CandidatoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar candidatos.
    Todos pueden ver (incluso sin autenticación), solo admin puede crear, editar y eliminar.
    """
    queryset = Candidato.objects.all()
    serializer_class = CandidatoSerializer
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación para ver

    def get_permissions(self):
        """
        Permisos personalizados:
        - list y retrieve: permiten acceso sin autenticación (invitados)
        - create, update, destroy: requieren autenticación y ser admin
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        """Listar todos los candidatos (acceso público)"""
        try:
            user_info = request.user.username if request.user.is_authenticated else "Invitado"
            logger.info(f"Listando candidatos - Usuario: {user_info}")
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error al listar candidatos: {str(e)}")
            return Response(
                {'error': 'Error al obtener la lista de candidatos'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, *args, **kwargs):
        """Obtener un candidato por ID (acceso público)"""
        try:
            user_info = request.user.username if request.user.is_authenticated else "Invitado"
            logger.info(f"Obteniendo candidato {kwargs.get('pk')} - Usuario: {user_info}")
            return super().retrieve(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error al obtener candidato: {str(e)}")
            return Response(
                {'error': 'Candidato no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    def create(self, request, *args, **kwargs):
        """Crear un nuevo candidato (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Solo los administradores pueden crear candidatos'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            logger.info(f"Creando candidato - Usuario: {request.user}")
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            logger.info(f"Candidato creado exitosamente: {serializer.data.get('id')}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            logger.warning(f"Error de validación al crear candidato: {str(e)}")
            return Response(
                {'error': 'Datos inválidos', 'detalles': e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error al crear candidato: {str(e)}")
            return Response(
                {'error': 'Error al crear el candidato'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        """Actualizar un candidato (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Solo los administradores pueden actualizar candidatos'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            logger.info(f"Actualizando candidato {kwargs.get('pk')} - Usuario: {request.user}")
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error al actualizar candidato: {str(e)}")
            return Response(
                {'error': 'Error al actualizar el candidato'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, *args, **kwargs):
        """Eliminar un candidato (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Solo los administradores pueden eliminar candidatos'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            logger.info(f"Eliminando candidato {kwargs.get('pk')} - Usuario: {request.user}")
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error al eliminar candidato: {str(e)}")
            return Response(
                {'error': 'Error al eliminar el candidato'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'])
    def adoptar(self, request, pk=None):
        """Toggle del estado de adopción de un candidato"""
        try:
            candidato = get_object_or_404(Candidato, pk=pk)
            candidato.adoptado = not candidato.adoptado
            candidato.save()
            
            logger.info(
                f"Candidato {pk} {'adoptado' if candidato.adoptado else 'disponible'} "
                f"- Usuario: {request.user}"
            )
            
            serializer = self.get_serializer(candidato)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al cambiar estado de adopción: {str(e)}")
            return Response(
                {'error': 'Error al actualizar el estado de adopción'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

