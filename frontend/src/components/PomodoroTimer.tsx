import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(0); // Aqui muda o tempo de pomodoro
  const [seconds, setSeconds] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Foco' | 'Pausa'>('Foco');
  // ADICIONE ESTA LINHA:
  const [startTime, setStartTime] = useState<string | null>(null);

  
  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // O tempo acabou!
          handleTimerEnd();
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  async function handleTimerEnd() {
    setIsActive(false);
    
    if (mode === 'Foco') {
      try {
        // ENVIANDO EXATAMENTE O QUE O DJANGO PEDIU
        await api.post('focus-sessions/', {
          start_time: startTime, // A hora que registramos lá no toggleTimer
          duration: 25, // <-- Colocamos a duração de volta!
          session_type: 'focus', // MUITO IMPORTANTE: Verifique no seu models.py quais são as opções. Pode ser 'pomodoro', 'foco', 'work', etc.
        });
        
        alert("Excelente! Sessão de foco guardada no banco de dados.");
        setMode('Pausa');
        setMinutes(5);
      } catch (error: any) {
        console.error("Erro do Django:", error.response?.data);
      }
    } else {
      alert("Pausa terminada! Pronto para focar?");
      setMode('Foco');
      setMinutes(25);
    }
    setSeconds(0);
  }

  // 1. O botão de INICIAR / PAUSAR o relógio
  function toggleTimer() {
    // Agora ele salva a hora de início sempre, seja para Foco ou para Pausa!
    if (!isActive) {
      setStartTime(new Date().toISOString()); 
    }
    setIsActive(!isActive);
  }

  // 2. O novo botão colorido de TROCAR O MODO (Focus <-> Break)
  function toggleMode() {
    setIsActive(false); // Pausa o relógio por segurança
    
    if (mode === 'Foco') {
      setMode('Pausa');
      setMinutes(5);
    } else {
      setMode('Foco');
      setMinutes(25);
    }
    setSeconds(0);
  }

  function resetTimer() {
    setIsActive(false);
    setMinutes(mode === 'Foco' ? 25 : 5);
    setSeconds(0);
  }


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {/* Botão de Alternância de Modo */}
      <button 
        onClick={toggleMode}
        style={{
          padding: '8px 20px',
          fontSize: '1rem',
          fontWeight: 'bold',
          // Muda de cor: Azul para ir pro Break, Laranja para voltar pro Focus
          backgroundColor: mode === 'Foco' ? '#3498db' : '#e67e22', 
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'background-color 0.3s'
        }}
      >
        {mode === 'Foco' ? 'Break' : 'Focus'}
      </button>
      
      <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '20px 0', fontFamily: 'monospace' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button 
          onClick={toggleTimer}
          style={{
            padding: '10px 25px',
            fontSize: '1rem',
            backgroundColor: isActive ? '#f1c40f' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>

        <button 
          onClick={resetTimer}
          style={{
            padding: '10px 25px',
            fontSize: '1rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}