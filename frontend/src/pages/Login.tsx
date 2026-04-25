import { useState } from 'react';
import axios from 'axios';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); 
    setError(''); 

    try {
      // Faz o POST para o seu Django pegar o Token
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      // Pega o token de acesso da resposta
      const accessToken = response.data.access;

      // Salva no navegador
      localStorage.setItem('@UFocus:token', accessToken);

      alert("Login com sucesso! O Token foi salvo.");
      // Depois vamos redirecionar para o Dashboard aqui!
      
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