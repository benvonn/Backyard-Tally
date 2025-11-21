import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}