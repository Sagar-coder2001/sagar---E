import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../../Features/Authslice';

function Protected({ children }) {
  const user = useSelector(selectLoggedInUser);
  

  if (!user) {
    return <Navigate to="/Loginpage" replace={true}></Navigate>;
  }
  return children;
}

export default Protected;