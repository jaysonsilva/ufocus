import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface UserProfile {
  username: string;
  first_name: string;
  email: string;
}

export function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        // O intercetor injeta o token automaticamente aqui
        const response = await api.get('me/');
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleLogout() {
    localStorage.clear(); // Remove tokens e outras chaves
    navigate('/login');
  }

  if (loading) return <div style={{ padding: '50px' }}>A carregar ambiente de trabalho...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
        <div>
          <h1>U FOCUS</h1>
          <p>Bem-vindo, <strong>{user?.first_name || user?.username}</strong>!</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sair da Sessão
        </button>
      </header>

      <main style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Espaço para o Pomodoro */}
        <section style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2>Cronómetro Pomodoro</h2>
          <p>Prepara-te para a próxima sessão de foco.</p>
          {/* O componente do Timer entrará aqui */}
        </section>

        {/* Espaço para a Lista de Tarefas */}
        <section style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2>As Tuas Tarefas</h2>
          <p>Consulta as tuas metas diárias de engenharia.</p>
          {/* A lista de tarefas entrará aqui */}
        </section>
      </main>
    </div>
  );
}