import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';


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