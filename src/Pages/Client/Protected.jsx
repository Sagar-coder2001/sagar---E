import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../../Features/Authslice';

function Protected({ children }) {
  const user = useSelector(selectLoggedInUser);
  const parsedUser = user ? JSON.parse(user) : null;
  const role = parsedUser?.role;

  if (!user) {
    // Not logged in? Redirect to login
    return <Navigate to="/Loginpage" replace />;
  }

  // Redirect admin to Adminhomepage
  if (role === 'admin') {
    return <Navigate to="/Adminhomepage" replace />;
  }

  // Redirect all other users to main homepage
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If no redirection is needed (e.g., already on correct page), render children
  return children;
}

export default Protected;
