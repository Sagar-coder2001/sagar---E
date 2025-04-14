import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser, signoutAsync } from '../../Features/Authslice';

const Logoutpage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    if (user) {
      dispatch(signoutAsync());
    }
  }, [dispatch, user]);

  // Once user is null (after logout), redirect to login page
  if (!user) {
    return <Navigate to="/Loginpage" replace />;
  }

  return <div>Logging out...</div>; // Optional: show a "logging out" message
};

export default Logoutpage;
