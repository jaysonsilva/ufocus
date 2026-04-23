from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Task, FocusSession

# Configuração para o Usuário Customizado
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'date_joined')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informações de Estudo', {'fields': ('profile_picture', 'pomodo_config')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('email', 'first_name')}),
        ('Informações de Estudo', {'fields': ('profile_picture', 'pomodo_config')}),
    )

# Configuração para as Tarefas
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_completed', 'created_at') # Colunas que aparecem na lista
    list_filter = ('is_completed', 'user') # Filtros na lateral direita
    search_fields = ('title',) # Barra de busca por título

# Configuração para as Sessões de Foco
@admin.register(FocusSession)
class FocusSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'session_type', 'duration', 'start_time')
    list_filter = ('session_type', 'user', 'start_time')
    # Permite ordenar por duração clicando no cabeçalho da coluna
    ordering = ('-start_time',)

# A linha "admin.site.register" foi removida daqui, pois o "@admin.register" já faz o trabalho!