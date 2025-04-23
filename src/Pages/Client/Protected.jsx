import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../../Features/Authslice';

function Protected({ children }) {
  const user = useSelector(selectLoggedInUser);
  const parsedUser = user ? user : null;
  const role = parsedUser?.role;

  // Not logged in? Redirect to login
  if (!user) {
    return <Navigate to="/Loginpage" replace />;
  }

  // You can add custom logic here if you only want certain roles
  // For example, if this route is only for admin:
  // if (role !== 'admin') return <Navigate to="/" replace />;

  // User is allowed, render the protected content
  return children;
}

export default Protected;
