from django.db import models
from django.core.validators import MinValueValidator
from apps.candidatos.models import Candidato


class Visita(models.Model):
    """Modelo para visitas planificadas"""
    ESTADO_CHOICES = [
        ('planificada', 'Planificada'),
        ('realizada', 'Realizada'),
        ('cancelada', 'Cancelada'),
    ]
    
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE, related_name='visitas')
    fecha_visita = models.DateTimeField()
    visitante_nombre = models.CharField(max_length=100)
    visitante_email = models.EmailField()
    visitante_telefono = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='planificada')
    notas = models.TextField(blank=True, null=True)
    comentario_final = models.TextField(blank=True, null=True, verbose_name='Comentario Final')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['fecha_visita']
        verbose_name = 'Visita'
        verbose_name_plural = 'Visitas'

    def __str__(self):
        return f"Visita de {self.visitante_nombre} - {self.fecha_visita.strftime('%Y-%m-%d %H:%M')}"

