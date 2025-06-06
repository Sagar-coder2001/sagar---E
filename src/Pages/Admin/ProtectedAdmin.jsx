import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../../Features/Authslice';

function ProtectedAdmin({ children }) {
  const user = useSelector(selectLoggedInUser);

  if (!user) {
    return <Navigate to="/Loginpage" replace={true}></Navigate>;
  }
  // if (role =='admin') {
  //   return <Navigate to="/Adminhomepage" replace={true}></Navigate>;
  // }
  return children;
}

export default ProtectedAdmin;