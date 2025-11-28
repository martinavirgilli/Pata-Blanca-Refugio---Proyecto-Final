from django.db import models
from django.core.validators import MinValueValidator


class Candidato(models.Model):
    """Modelo para representar un candidato a adopción"""
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)  # Perro, Gato, etc.
    edad = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    descripcion = models.TextField()
    imagen = models.URLField(blank=True, null=True)
    adoptado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = 'Candidato'
        verbose_name_plural = 'Candidatos'

    def __str__(self):
        return f"{self.nombre} - {self.especie}"

