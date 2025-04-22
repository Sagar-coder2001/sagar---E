import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pagenotfound from './Pages/Client/Pagenotfound';
import Homepage from './Pages/Client/Homepage';
import Cartpage from './Pages/Client/Cartpage';
import Checkoutpage from './Pages/Client/Checkoutpage';
import Loginpage from './Pages/Client/Loginpage';
import Signuppage from './Pages/Client/Signuppage';
import Productdetailspage from './Pages/Client/Productdetailspage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from './Features/Authslice';
import { fechItemByProductIdAsync } from './Features/Cartslice';
import Ordersuccesspage from './Pages/Client/Ordersuccesspage';
import Orderpage from './Pages/Client/Userorderpage';
import Userprofilepage from './Pages/Client/Userprofilepage';
import Logoutpage from './Pages/Client/Logoutpage';
import Forgotpasswordpage from './Pages/Client/Forgotpasswordpage';
import Adminhomepage from './Pages/Admin/Adminhomepage';
import Adminproductformpage from './Pages/Admin/Adminproductformpage';
import AdminOrders from './Pages/Admin/Adminorderpage';
import { fetchLoggedInUserAsync, fetchUserOrderToAsync } from './Features/Userslice';
import Admindashboardpage from './Pages/Admin/Admindashboardpage';
import Adminproductdetailpage from './Pages/Admin/Adminproductdetailpage';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  console.log('User:', user);  // Log the user object to check its structure

  useEffect(() => {
    if (user) {  // Check if user is defined and has an ID
      // Fetch items based on the user ID
      dispatch(fechItemByProductIdAsync(user.id));  // Pass user.id instead of the entire user object
      dispatch(fetchLoggedInUserAsync(user.id));  // Fetch logged-in user details
      dispatch(fetchUserOrderToAsync(user.id));  // Fetch user orders
    }
  }, [dispatch, user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />

          <Route path='*' element={<Pagenotfound />} />
          <Route path='/Cartpage' element={<Cartpage />} />
          <Route path='/Loginpage' element={<Loginpage />} />
          <Route path='/Signuppage' element={<Signuppage />} />
          <Route path='/Checkoutpage' element={<Checkoutpage />} />
          <Route path='/Productdetailspage/:id' element={<Productdetailspage />} />
          <Route path='/Ordersuccesspage' element={<Ordersuccesspage />} />
          <Route path='/Orderpage.jsx' element={<Orderpage />} />
          <Route path='/Userprofilepage' element={<Userprofilepage />} />
          <Route path='/Logoutpage' element={<Logoutpage />} />
          <Route path='/Forgotpasswordpage' element={<Forgotpasswordpage />} />


          {/* Admin Routes */}
          <Route path='/Adminhomepage' element={<Adminhomepage />} />
          <Route path='/Admindashboardpage' element={<Admindashboardpage />} />
          <Route path='/Adminproductformpage' element={<Adminproductformpage />} />
          <Route path='/Adminproductformpage/edit/:id' element={<Adminproductformpage />} />
          <Route path='/Adminorderpage' element={<AdminOrders />} />
          <Route path='/Adminproductdetailpage/:id' element={<Adminproductdetailpage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
