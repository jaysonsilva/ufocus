import React from 'react';

export function Metrics() {
  return (
    <section 
      style={{ 
        padding: '30px', 
        backgroundColor: 'white', 
        border: '1px solid #eee', 
        borderRadius: '16px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        height: '100%', // Faz o retângulo esticar para acompanhar a altura da coluna
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '1.5rem' }}>Visão Geral</h2>
      
      {/* Container temporário pontilhado para indicar onde os gráficos vão entrar */}
      <div 
        style={{ 
          flex: 1, // Preenche todo o espaço restante do retângulo
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#fcfcfc', 
          borderRadius: '12px', 
          border: '2px dashed #e0e0e0',
          minHeight: '400px' // Garante uma altura mínima bonita para o lado direito
        }}
      >
        <p style={{ color: '#aaa', fontWeight: '500' }}>Os gráficos de energia e produtividade entrarão aqui</p>
      </div>
    </section>
  );
}