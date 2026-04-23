from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # O Django já traz username, email, password, first_name e date_joined no AbstractUser
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # Configurações do Pomodoro em JSON
    # Valor padrão sugerido: {"work_time": 25, "short_break": 5, "long_break": 15}
    pomodo_config = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.username

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class FocusSession(models.Model):
    SESSION_CHOICES = [
        ('focus', 'Foco'),
        ('short_break', 'Pausa Curta'),
        ('long_break', 'Pausa Longa'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='focus_sessions')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.PositiveIntegerField(help_text="Duração em minutos")
    session_type = models.CharField(max_length=20, choices=SESSION_CHOICES)

    def __str__(self):
        return f"{self.session_type} ({self.duration}min) - {self.user.username}"