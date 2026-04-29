import React from 'react';

// Se você tiver os SVGs como arquivos separados (ex: logo.svg), você pode importá-los assim no futuro:
import logoSvg from '../assets/Logo.svg';
import dashIconSvg from '../assets/icon_dashbord.svg';
import logoutIconSvg from '../assets/icon_logout.svg';

import { useNavigate } from 'react-router-dom';

export function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <aside 
      style={{ 
        width: '220px', 
        height: '100vh', // Ocupa a altura total da tela
        backgroundColor: '#003366', // Cor de fundo do menu (pode alterar para a cor da sua marca)
        borderRadius: '0 20px 20px 0', // Arredonda apenas o topo-direito e base-direita
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', // Centraliza os itens horizontalmente
        paddingTop: '48px', // Distância do topo
        position: 'sticky', // Faz o menu acompanhar a tela se você rolar para baixo
        top: 0,
        boxShadow: '4px 0px 10px rgba(0,0,0,0.05)' // Uma sombra leve para destacar do fundo
      }}
    >
      {/* 1. SUBSTITUIÇÃO DA LOGO */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {/* Usamos a tag img e passamos a importação no src */}
        <img 
          src={logoSvg} 
          alt="U Focus Logo" 
          style={{ width: '100px', height: 'auto' }} // Ajuste o tamanho aqui
        />
      </div>


      {/* 2. ÁREA DO BOTÃO DASHBOARD */}
      <div style={{ 
        marginTop: '72px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        cursor: 'pointer' 
      }}>
         {/* O RETÂNGULO DO BOTÃO */}
         <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', // Centraliza o SVG dentro do botão
            width: '250px',           // Largura exata pedida
            height: '72px',          // Altura exata pedida
            backgroundColor: '#003366', // Cor do retângulo (mais claro que o fundo)
            borderRadius: '0px',      // Mantém as bordas arredondadas do botão
            transition: 'background-color 0.2s'
         }}>
            
            {/* O SEU ÍCONE SVG */}
            <img 
              src={dashIconSvg} 
              alt="Dashboard" 
              style={{ 
                height: '25px', // Ajustei a altura para ficar proporcional aos 72px de altura do botão
                width: 'auto' 
              }} 
            />
            
         </div>
      </div>

      {/* ESPAÇADOR FLEXÍVEL: Empurra o que estiver abaixo para o fim da tela */}
      <div style={{ flex: 1 }}></div>

      {/* 3. BOTÃO LOGOUT (Novo) */}
      <div 
        onClick={handleLogout}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer' , marginBottom: '48px'}}
      >
         <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '250px',
            height: '10px',
            backgroundColor: '#003366', // Mesma cor do dashboard
            borderRadius: '0px',
            transition: 'background-color 0.2s'
         }}
         // Efeito simples de hover para feedback visual
         //onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4e5666'}
         //onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3d4450'}
         >
            <img 
              src={logoutIconSvg} 
              alt="Sair" 
              style={{ height: '25px', width: 'auto' }} 
            />
         </div>
      </div>

    </aside>
  );
}