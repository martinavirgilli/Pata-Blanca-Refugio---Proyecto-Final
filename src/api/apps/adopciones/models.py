from django.db import models
from apps.candidatos.models import Candidato


class Adopcion(models.Model):
    """Modelo para registrar adopciones"""
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE, related_name='adopciones')
    fecha_adopcion = models.DateTimeField(auto_now_add=True)
    adoptante_nombre = models.CharField(max_length=100, blank=True, null=True)
    adoptante_email = models.EmailField(blank=True, null=True)
    notas = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-fecha_adopcion']
        verbose_name = 'Adopción'
        verbose_name_plural = 'Adopciones'

    def __str__(self):
        return f"Adopción de {self.candidato.nombre} - {self.fecha_adopcion.strftime('%Y-%m-%d')}"

