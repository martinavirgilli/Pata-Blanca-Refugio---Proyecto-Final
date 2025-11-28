from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
import logging

from .models import Visita
from .serializers import VisitaSerializer
from apps.auth_app.permissions import IsAdmin

logger = logging.getLogger('apps.visitas')


class VisitaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar visitas planificadas.
    CRUD completo con autenticación JWT.
    Solo administradores pueden crear, editar y eliminar visitas.
    """
    queryset = Visita.objects.all()
    serializer_class = VisitaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrar solo visitas futuras"""
        queryset = Visita.objects.filter(fecha_visita__gte=timezone.now())
        return queryset.order_by('fecha_visita')

    def list(self, request, *args, **kwargs):
        """Listar todas las visitas futuras (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'No tienes permisos para ver visitas'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            logger.info(f"Listando visitas - Usuario: {request.user}")
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error al listar visitas: {str(e)}")
            return Response(
                {'error': 'Error al obtener la lista de visitas'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        """Crear una nueva visita (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Solo los administradores pueden crear visitas'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            logger.info(f"Creando visita - Usuario: {request.user}")
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            logger.info(f"Visita creada exitosamente: {serializer.data.get('id')}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error al crear visita: {str(e)}")
            return Response(
                {'error': 'Error al crear la visita', 'detalles': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """Eliminar una visita (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Solo los administradores pueden eliminar visitas'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            logger.info(f"Eliminando visita {kwargs.get('pk')} - Usuario: {request.user}")
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error al eliminar visita: {str(e)}")
            return Response(
                {'error': 'Error al eliminar la visita'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'])
    def agregar_comentario(self, request, pk=None):
        """Agregar comentario final a una visita (solo admin)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Solo los administradores pueden agregar comentarios'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            visita = get_object_or_404(Visita, pk=pk)
            comentario = request.data.get('comentario_final', '')
            
            if not comentario or not comentario.strip():
                return Response(
                    {'error': 'El comentario no puede estar vacío'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            visita.comentario_final = comentario.strip()
            visita.estado = 'realizada'
            visita.save()
            
            logger.info(f"Comentario agregado a visita {pk} - Usuario: {request.user}")
            
            serializer = self.get_serializer(visita)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error al agregar comentario: {str(e)}")
            return Response(
                {'error': 'Error al agregar el comentario'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

