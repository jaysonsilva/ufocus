from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrentUserView, FocusSessionViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'focus-sessions', FocusSessionViewSet, basename='focussession')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]