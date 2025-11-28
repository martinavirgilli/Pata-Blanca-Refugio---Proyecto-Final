from rest_framework import serializers
from django.utils import timezone
from .models import Visita
from apps.candidatos.serializers import CandidatoSerializer


class VisitaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Visita"""
    candidato_detalle = CandidatoSerializer(source='candidato', read_only=True)
    
    class Meta:
        model = Visita
        fields = [
            'id', 'candidato', 'candidato_detalle', 'fecha_visita',
            'visitante_nombre', 'visitante_email', 'visitante_telefono',
            'estado', 'notas', 'comentario_final', 'fecha_creacion', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']

    def validate_visitante_email(self, value):
        """Validar formato de email"""
        if not value or '@' not in value:
            raise serializers.ValidationError("Debe proporcionar un email válido.")
        return value

    def validate_visitante_nombre(self, value):
        """Validar que el nombre no esté vacío"""
        if not value or not value.strip():
            raise serializers.ValidationError("El nombre del visitante no puede estar vacío.")
        return value.strip()

    def validate_fecha_visita(self, value):
        """Validar que la fecha de visita sea futura"""
        if value and value <= timezone.now():
            raise serializers.ValidationError("La fecha de visita debe ser futura.")
        return value

