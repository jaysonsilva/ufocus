import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { TaskList } from '../components/TaskList';
import { PomodoroTimer } from '../components/PomodoroTimer';
// IMPORTANDO O NOSSO NOVO MENU
import { Sidebar } from '../components/SideBar.tsx'; 
import { Header } from '../components/Header';

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

  

  if (loading) return <div style={{ padding: '50px' }}>A carregar ambiente de trabalho...</div>;

  return (
    // CONTÊINER PRINCIPAL
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' }}>
      
      {/* MENU LATERAL */}
      <Sidebar />

      {/* ÁREA PRINCIPAL DO DASHBOARD (A direita) */}
      {/* 1. Removemos o padding daqui e mudamos para display flex em coluna */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* 2. O SEU NOVO HEADER ENTRA AQUI (Substituindo a tag <header> antiga) */}
        <Header 
          name={user?.first_name || user?.username || 'Usuário'} 
          email={user?.email || 'email@exemplo.com'} 
        />

        {/* 3. Colocamos o padding de 40px apenas em volta do conteúdo principal */}
        <div style={{ padding: '40px' }}>
          
          <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* Espaço para o Pomodoro */}
            <section style={{ padding: '30px', backgroundColor: 'white', border: '1px solid #eee', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h2 style={{ marginBottom: '15px' }}>Foco Atual</h2>
              <PomodoroTimer />
            </section>

            {/* Espaço para a Lista de Tarefas */}
            <section style={{ padding: '30px', backgroundColor: 'white', border: '1px solid #eee', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h2 style={{ marginBottom: '15px' }}>As Tuas Tarefas</h2>
              <TaskList />
            </section>

          </main>
          
        </div>

      </div>

    </div>
  );
}