import { useState, useEffect } from 'react';
import { api } from '../services/api';

// Essa interface "blinda" o TypeScript para ele saber o formato exato que vem do Django
interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Busca as tarefas assim que o componente aparece na tela
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await api.get('tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await api.post('tasks/', { title: newTaskTitle });
      // Adiciona a nova tarefa na lista sem precisar recarregar a página
      setTasks([...tasks, response.data]);
      setNewTaskTitle(''); 
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  }

  async function handleToggleComplete(task: Task) {
    try {
      const response = await api.patch(`tasks/${task.id}/`, {
        is_completed: !task.is_completed
      });
      // Atualiza apenas a tarefa modificada na tela
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`tasks/${id}/`);
      // Remove a tarefa da tela
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }

  if (loading) return <p>Carregando tarefas...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Formulário para adicionar nova tarefa */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="O que vais estudar hoje?" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Adicionar
        </button>
      </form>

      {/* Lista das tarefas existentes */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.9em' }}>Nenhuma tarefa pendente. Excelente!</p>
        ) : (
          tasks.map(task => (
            <li key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '4px', borderLeft: task.is_completed ? '4px solid #4CAF50' : '4px solid #ff9800' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={task.is_completed} 
                  onChange={() => handleToggleComplete(task)} 
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ textDecoration: task.is_completed ? 'line-through' : 'none', color: task.is_completed ? '#888' : '#333' }}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(task.id)}
                style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2em' }}
                title="Deletar tarefa"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}