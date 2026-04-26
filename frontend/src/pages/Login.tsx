import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe isso!
import { api } from '../services/api'; // Use a nossa instância configurada

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Instancie o navegador

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); 
    setError(''); 

    try {
      // USANDO A API LOCAL (Com interceptador e base URL)
      const response = await api.post('token/', { username, password });

      const { access, refresh } = response.data;

      // Guardamos os dois tokens
      localStorage.setItem('@UFocus:token', access);
      localStorage.setItem('@UFocus:refreshToken', refresh);

      // REDIRECIONAMENTO AUTOMÁTICO
      navigate('/dashboard'); 
    } catch (err) {
      setError('Usuário ou senha incorretos.');
    }
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>U FOCUS - Login</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Usuário</label><br/>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Senha</label><br/>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#282c34', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}