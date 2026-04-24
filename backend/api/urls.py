from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrentUserView, FocusSessionViewSet, TaskViewSet, RegisterView

# 1. Primeiro criamos o router e registramos os ViewSets
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'focus-sessions', FocusSessionViewSet, basename='focussession')

# 2. Depois criamos UMA ÚNICA lista de urlpatterns, juntando tudo
urlpatterns = [
    # Inclui as rotas automáticas do router (ex: /tasks/, /focus-sessions/)
    path('', include(router.urls)),
    
    # Suas rotas customizadas (sem ID)
    path('register/', RegisterView.as_view(), name='register'), 
    path('me/', CurrentUserView.as_view(), name='current-user'),
]