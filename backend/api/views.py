from rest_framework import generics, permissions, viewsets

from .models import FocusSession, Task, User
from .serializers import FocusSessionSerializer, TaskSerializer, UserSerializer


class UserOwnedViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    owner_field = 'user'
    ordering = None

    def get_queryset(self):
        queryset = self.model.objects.filter(**{self.owner_field: self.request.user}).select_related('user')

        if self.ordering:
            return queryset.order_by(self.ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(**{self.owner_field: self.request.user})


class TaskViewSet(UserOwnedViewSet):
    serializer_class = TaskSerializer
    model = Task
    ordering = '-created_at'


class FocusSessionViewSet(UserOwnedViewSet):
    serializer_class = FocusSessionSerializer
    model = FocusSession
    ordering = '-start_time'


class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user