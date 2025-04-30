import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from './Features/Authslice';
import { fechItemByProductIdAsync } from './Features/Cartslice';
import { fetchLoggedInUserAsync, fetchUserOrderToAsync } from './Features/Userslice';
import { BounceLoader } from 'react-spinners';

// Lazy-loaded pages
const Homepage = lazy(() => import('./Pages/Client/Homepage'));
const Cartpage = lazy(() => import('./Pages/Client/Cartpage'));
const Checkoutpage = lazy(() => import('./Pages/Client/Checkoutpage'));
const Loginpage = lazy(() => import('./Pages/Client/Loginpage'));
const Signuppage = lazy(() => import('./Pages/Client/Signuppage'));
const Productdetailspage = lazy(() => import('./Pages/Client/Productdetailspage'));
const Ordersuccesspage = lazy(() => import('./Pages/Client/Ordersuccesspage'));
const Orderpage = lazy(() => import('./Pages/Client/Userorderpage'));
const Userprofilepage = lazy(() => import('./Pages/Client/Userprofilepage'));
const Logoutpage = lazy(() => import('./Pages/Client/Logoutpage'));
const Forgotpasswordpage = lazy(() => import('./Pages/Client/Forgotpasswordpage'));
const Pagenotfound = lazy(() => import('./Pages/Client/Pagenotfound'));

// Admin Pages
const Adminhomepage = lazy(() => import('./Pages/Admin/Adminhomepage'));
const Adminproductformpage = lazy(() => import('./Pages/Admin/Adminproductformpage'));
const AdminOrders = lazy(() => import('./Pages/Admin/Adminorderpage'));
const Admindashboardpage = lazy(() => import('./Pages/Admin/Admindashboardpage'));
const Adminproductdetailpage = lazy(() => import('./Pages/Admin/Adminproductdetailpage'));

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    if (user) {
      dispatch(fechItemByProductIdAsync(user.id));
      dispatch(fetchLoggedInUserAsync(user.id));
      dispatch(fetchUserOrderToAsync(user.id));
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex justify-center items-center"><BounceLoader color="#7fd4b8" /></div>}>
        <Routes>
          <Route path='/' element={<Homepage />} />
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

          <Route path='*' element={<Pagenotfound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
