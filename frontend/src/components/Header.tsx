import React from 'react';

interface HeaderProps {
  name: string;
  email: string;
}

export function Header({ name, email }: HeaderProps) {
  return (
    <header 
      style={{ 
        height: '70px', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end', // Alinha as informações à direita
        padding: '0 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>
          {name}
        </p>
        <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
          {email}
        </p>
      </div>
    </header>
  );
}