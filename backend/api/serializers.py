from rest_framework import serializers
from .models import User, Task, FocusSession

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'profile_picture', 'pomodo_config']
        read_only_fields = ['id']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'is_completed', 'created_at', 'completed_at', 'user']
        read_only_fields = ['id', 'user', 'created_at']

    def validate(self, attrs):
        is_completed = attrs.get('is_completed', getattr(self.instance, 'is_completed', False))
        completed_at = attrs.get('completed_at', getattr(self.instance, 'completed_at', None))

        if is_completed and completed_at is None:
            raise serializers.ValidationError({'completed_at': 'This field is required when the task is completed.'})

        if not is_completed and completed_at is not None:
            raise serializers.ValidationError({'completed_at': 'This field must be empty when the task is not completed.'})

        return attrs

class FocusSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FocusSession
        fields = ['id', 'start_time', 'end_time', 'duration', 'session_type', 'user']
        read_only_fields = ['id', 'user']

    def validate(self, attrs):
        start_time = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end_time = attrs.get('end_time', getattr(self.instance, 'end_time', None))
        duration = attrs.get('duration', getattr(self.instance, 'duration', None))

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError({'end_time': 'End time must be after start time.'})

        if duration is not None and duration <= 0:
            raise serializers.ValidationError({'duration': 'Duration must be greater than zero.'})

        return attrs