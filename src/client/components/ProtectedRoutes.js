import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserMetadata, setUserMetadata } from '../utils/onboarding';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (setUserMetadata.redirectcount >= 3) {
    return alert("You need to login to begin!")
  }
  if (!isLoggedIn()) {
    return <Navigate to="/user/profile" replace />;
  }

  return children;
}