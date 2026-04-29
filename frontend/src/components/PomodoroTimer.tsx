import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

// Configurações de tempo (em minutos)
const FOCUS_MINUTES = 1;
const BREAK_MINUTES = 5;

// Função auxiliar para formatar o tempo (ex: 25:00)
function formatTime(minutes: number, seconds: number) {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(FOCUS_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Foco' | 'Pausa'>('Foco');
  const [startTime, setStartTime] = useState<string | null>(null);

  // --- LÓGICA DO TEMPORIZADOR (MANTIDA DO SEU CÓDIGO) ---
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
          void handleTimerEnd();
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
        await api.post('focus-sessions/', {
          start_time: startTime,
          duration: FOCUS_MINUTES,
          session_type: 'focus',
        });

        alert("Excelente! Sessão de foco guardada no banco de dados.");
        setMode('Pausa');
        setMinutes(BREAK_MINUTES);
      } catch (error: any) {
        console.error("Erro do Django:", error.response?.data);
      }
    } else {
      alert("Pausa terminada! Pronto para focar?");
      setMode('Foco');
      setMinutes(FOCUS_MINUTES);
    }

    setSeconds(0);
  }

  function toggleTimer() {
    if (!isActive) {
      setStartTime(new Date().toISOString());
    }
    setIsActive(!isActive);
  }

  function toggleMode() {
    setIsActive(false);

    if (mode === 'Foco') {
      setMode('Pausa');
      setMinutes(BREAK_MINUTES);
    } else {
      setMode('Foco');
      setMinutes(FOCUS_MINUTES);
    }

    setSeconds(0);
  }

  function resetTimer() {
    setIsActive(false);
    setMinutes(mode === 'Foco' ? FOCUS_MINUTES : BREAK_MINUTES);
    setSeconds(0);
  }

  // --- CÁLCULO DO PROGRESSO DO CÍRCULO ---
  // Usamos useMemo para recalcular apenas quando o tempo mudar
  const totalSeconds = useMemo(() => (mode === 'Foco' ? FOCUS_MINUTES : BREAK_MINUTES) * 60, [mode]);
  const remainingSeconds = minutes * 60 + seconds;
  const progress = Math.min(Math.max((totalSeconds - remainingSeconds) / totalSeconds, 0), 1); // 0 a 1

  // Parâmetros do círculo SVG (raio 96 para caber num container de 240px)
  const strokeDasharray = 2 * Math.PI * 96; // Circunferência
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    // REMOVIDO: backgroundColor, padding, borderRadius, boxShadow e width fixa
    <div style={{
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between', // Espalha o título em cima, círculo no meio e botões embaixo
      fontFamily: 'sans-serif'
    }}>
      {/* Título do Cartão (Título discreto no topo) */}
      {/* Título do Cartão (Título discreto no topo) */}
      <div style={{ alignSelf: 'flex-start', color: '#a0aec0', fontWeight: 'bold', fontSize: '1rem', marginBottom: '20px' }}>
        Pomodoro Timer
      </div>

      {/* ÁREA DO CÍRCULO (Relative para segurar o conteúdo absoluto dentro) */}
      <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* O CÍRCULO SVG (Progresso) */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 240 240">
          <defs>
            {/* Gradiente do rastro (claro) */}
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#edf2f7" />
              <stop offset="100%" stopColor="#b8c7d7" />
            </linearGradient>
            {/* Gradiente do progresso (escuro) */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d4a86" />
              <stop offset="100%" stopColor="#6d8fb1" />
            </linearGradient>
          </defs>
          
          {/* Círculo do Rastro (Estático, cinza claro) */}
          <circle 
            cx="120" cy="120" r="96" 
            fill="none" 
            stroke="url(#trackGradient)" 
            strokeWidth="12"
          />
          
          {/* Círculo do Progresso (Animado, azul) */}
          <circle 
            cx="120" cy="120" r="96" 
            fill="none" 
            stroke="url(#progressGradient)" 
            strokeWidth="12" 
            strokeLinecap="round" // Pontas arredondadas
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }} // Animação suave
          />
        </svg>

        {/* CONTEÚDO DENTRO DO CÍRCULO (Tempo, Modo e Ícones) */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#1a1a1a', lineHeight: 1 }}>
            {formatTime(minutes, seconds)}
          </div>
          
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', color: '#888', margin: '4px 0 16px 0' }}>
            {mode === 'Foco' ? 'FOCUS' : 'RELAX'}
          </div>

          {/* Botões de Controle (Ícones) */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Botão Play/Pause */}
            <button onClick={toggleTimer} style={iconButtonStyle}>
              {isActive ? (
                // Ícone de Pause (duas barras)
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                // Ícone de Play (triângulo)
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Botão Reset */}
            <button onClick={resetTimer} style={iconButtonStyle}>
              {/* Ícone de Reiniciar (Seta circular) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* RODAPÉ (Ícone de configuração e Botão de modo) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
        {/* Ícone de Configuração (Engrenagem) */}
        <button style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {/* Botão de Pilula para Trocar Modo (Break/POMODORO) */}
        <button 
          onClick={toggleMode}
          style={{
            padding: '8px 24px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            backgroundColor: mode === 'Foco' ? '#0d4a86' : '#F5A623', // Azul do Figma ou Laranja
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {mode === 'Foco' ? 'BREAK' : 'POMODORO'}
        </button>
        
        {/* Espaçador invisível para centralizar o botão de modo */}
        <div style={{ width: '20px' }}></div>
      </div>

    </div>
  );
}

// Estilo reutilizável para os botões de ícone dentro do círculo
const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  color: '#1a1a1a', // Preto para os ícones centrais
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s',
};