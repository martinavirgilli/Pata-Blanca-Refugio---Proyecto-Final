from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
import logging

from apps.candidatos.models import Candidato
from apps.adopciones.models import Adopcion

logger = logging.getLogger('apps.adopciones')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resumen_adopciones(request):
    """Obtener resumen de adopciones"""
    try:
        logger.info(f"Obteniendo resumen de adopciones - Usuario: {request.user}")
        
        total = Candidato.objects.count()
        adoptados = Candidato.objects.filter(adoptado=True).count()
        disponibles = total - adoptados
        
        return Response({
            'total': total,
            'adoptados': adoptados,
            'disponibles': disponibles
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al obtener resumen de adopciones: {str(e)}")
        return Response(
            {'error': 'Error al obtener el resumen'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_adopciones(request):
    """Obtener historial completo de adopciones"""
    try:
        logger.info(f"Obteniendo historial de adopciones - Usuario: {request.user}")
        
        candidatos_adoptados = Candidato.objects.filter(adoptado=True).order_by('-fecha_actualizacion')
        
        historial = []
        for candidato in candidatos_adoptados:
            historial.append({
                'id': candidato.id,
                'nombre': candidato.nombre,
                'especie': candidato.especie,
                'edad': candidato.edad,
                'fecha_adopcion': candidato.fecha_actualizacion.isoformat(),
            })
        
        return Response(historial, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al obtener historial de adopciones: {str(e)}")
        return Response(
            {'error': 'Error al obtener el historial'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

