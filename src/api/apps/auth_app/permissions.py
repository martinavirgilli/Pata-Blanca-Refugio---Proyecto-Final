from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permiso personalizado para verificar si el usuario es administrador.
    Requiere que el usuario esté autenticado y sea staff o superuser.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )

