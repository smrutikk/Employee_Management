// src/components/RequireAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseConfig/firebase';

export function RequireAuth({ children, requiredRole }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      } else if (requiredRole && role !== requiredRole) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate, requiredRole, role]);

  return children;
}