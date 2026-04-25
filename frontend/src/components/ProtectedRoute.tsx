import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('@UFocus:token');

  // Se não tem token, redireciona para o login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}