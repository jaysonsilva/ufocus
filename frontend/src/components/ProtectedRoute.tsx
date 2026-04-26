import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem('@UFocus:token');

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsValid(false);
        return;
      }
      try {
        // Tenta buscar o perfil do usuário logado (endpoint que criamos no Django)
        await api.get('me/');
        setIsValid(true);
      } catch (error) {
        // Se a API der 401, o token expirou ou é falso
        localStorage.removeItem('@UFocus:token');
        setIsValid(false);
      }
    }
    validateToken();
  }, [token]);

  if (isValid === null) return <div>Carregando...</div>; // Evita piscar a tela
  
  return isValid ? children : <Navigate to="/login" />;
}