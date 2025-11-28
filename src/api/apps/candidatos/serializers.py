from rest_framework import serializers
from .models import Candidato


class CandidatoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Candidato"""
    
    class Meta:
        model = Candidato
        fields = ['id', 'nombre', 'especie', 'edad', 'descripcion', 
                  'imagen', 'adoptado', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']

    def validate_edad(self, value):
        """Validar que la edad sea un número positivo"""
        if value < 0:
            raise serializers.ValidationError("La edad no puede ser negativa.")
        if value > 30:
            raise serializers.ValidationError("La edad parece ser demasiado alta para una mascota.")
        return value

    def validate_nombre(self, value):
        """Validar que el nombre no esté vacío"""
        if not value or not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value.strip()

    def validate_especie(self, value):
        """Validar que la especie no esté vacía"""
        if not value or not value.strip():
            raise serializers.ValidationError("La especie no puede estar vacía.")
        return value.strip()

