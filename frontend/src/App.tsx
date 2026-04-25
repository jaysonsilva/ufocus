import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

// Um componente temporário para testar se o login redireciona corretamente
function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard U FOCUS</h1>
      <p>Bem-vindo! Se estás a ver isto, o login funcionou e o token foi salvo.</p>
    </div>
  );
}

function App() {
  return (
    // BrowserRouter: O "pai" que permite a navegação por URL
    <BrowserRouter>
      <Routes>
        {/* Se o utilizador entrar na raiz (/) redirecionamos para o /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rota para a página de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota para o Dashboard (protegida futuramente) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;