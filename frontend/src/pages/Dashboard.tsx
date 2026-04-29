import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { TaskList } from '../components/TaskList';
import { PomodoroTimer } from '../components/PomodoroTimer';
// IMPORTANDO O NOSSO NOVO MENU
import { Sidebar } from '../components/SideBar.tsx'; 
import { Header } from '../components/Header';
import { Metrics } from '../components/Metrics';

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


  // ADICIONE ESTA FUNÇÃO DE VOLTA:
  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }



  if (loading) return <div style={{ padding: '50px' }}>A carregar ambiente de trabalho...</div>;

return (
    // 1. O contêiner pai agora bloqueia QUALQUER vazamento (overflow: hidden)
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f4f7fb', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      <Sidebar onLogout={handleLogout} />

      {/* COLUNA DIREITA INTEIRA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* CABEÇALHO COM ALTURA TRAVADA: flex: '0 0 70px' impede ele de crescer ou encolher */}
        <div style={{ flex: '0 0 70px' }}>
          <Header 
            name={user?.first_name || user?.username || 'Usuário'} 
            email={user?.email || 'email@exemplo.com'} 
          />
        </div>

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        {/* Diminuí um pouco o padding vertical (20px) para dar mais espaço aos retângulos */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px', overflow: 'hidden' }}>
          
          {/* TÍTULO (Trava de altura natural: flex: '0 0 auto') */}
          <div style={{ flex: '0 0 auto', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1a1a1a' }}>Dashboard</h1>
            <p style={{ margin: '4px 0 0 0', color: '#888' }}>
              Welcome back, {user?.first_name || 'Fulano'}
            </p>
            <div style={{ height: '3px', width: '40px', backgroundColor: '#007bff', marginTop: '8px', borderRadius: '2px' }}></div>
          </div>

          {/* GRID RESPONSIVO (minHeight: 0 é o que faz os quadrados obedecerem o limite da tela) */}
          <main style={{ 
            flex: 1, 
            display: 'grid', 
            gridTemplateColumns: '1fr 1.6fr', 
            gap: '24px',
            minHeight: 0 
          }}>
            
            {/* COLUNA ESQUERDA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 0 }}>
              
              {/* POMODORO: Pega apenas o espaço que precisa (flex: '0 0 auto') */}
              <section style={{ 
                flex: '0 0 auto', 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                padding: '24px' 
              }}>
                <PomodoroTimer />
              </section>

              {/* TAREFAS: Pega o resto do espaço (flex: 1) e gera scroll interno se espremer */}
              <section style={{ 
                flex: 1, 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                overflow: 'hidden' 
              }}>
                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                  <TaskList />
                </div>
              </section>

            </div>

            {/* COLUNA DIREITA (MÉTRICAS) */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* O componente Metrics ocupará 100% dessa div */}
              <div style={{ flex: 1, overflow: 'hidden', borderRadius: '24px' }}>
                <Metrics />
              </div>
            </div>

          </main>
          
        </div>
      </div>
    </div>
  );
}