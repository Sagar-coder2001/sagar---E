import React, { useEffect } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Layout from '../../Components/Client/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { deleteItemAsync, selectCartItems, updateItemAsync } from '../../Features/Cartslice'
import { useForm } from 'react-hook-form'
import { selectLoggedInUser, updateUserAsync } from '../../Features/Authslice'
import { addOrderToAsync, Orderplacedstatus, selectOrders } from '../../Features/Orderslice'
import Protected from './Protected'
import { selectUserInfo } from '../../Features/Userslice'
import ScrollTop from '../../Components/Client/Common/Scolltop'
import { loadStripe } from '@stripe/stripe-js';

const Checkoutpage = () => {
  const navigate = useNavigate();
  const products = useSelector(selectCartItems);
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)
  // const products = useSelector((state) => state.product.data)
  const dispatch = useDispatch();
  const totalAmount = products.reduce(
    (amount, item) => item.product.price * item.quantity + amount,
    0
  );
  const totalItems = products.reduce((total, item) => item.quantity + total, 0);
  const user = useSelector(selectUserInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = (data) => {
    const updatedAddress = user.address ? [...user.address, data] : [data];
    dispatch(
      updateUserAsync({
        ...user,
        address: updatedAddress
        // addresses: [],
        // role:'user'
      })
    );
  }

  const [selectaddress, setSelectAdress] = useState('')
  const [selectpaymentmode, setSelectPaymentMode] = useState('')
  const currentorder = useSelector(selectOrders);  // `Orderplacedstatus` selector fetches currentorder


  const handleQuantity = (e, item) => {
    dispatch(updateItemAsync({ id: item.id, quantity: +e.target.value }));
  }

  const handleremove = (item) => {
    dispatch(deleteItemAsync(item.id));
  }

  const handleAddress = (e) => {
    setSelectAdress(user.address[e.target.value])
  }
  const handlePayment = (e) => {
    setSelectPaymentMode(e.target.value)
  }

  const handleOrder = async (e) => {
    // e.preventDefault();
    const order = { products, totalAmount, totalItems, user: user.id, selectpaymentmode, selectaddress, status: 'pending' }
    dispatch(addOrderToAsync(order));

    // 2. Create Stripe session
    const response = await fetch('https://sagar-e.onrender.com/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products, totalAmount, user, selectaddress }),
    });

    const session = await response.json();
    console.log(session)

    // 3. Redirect to Stripe
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  }


  // useEffect(() => {
  //   if (currentorder) {
  //     // Order placed successfully, now navigate
  //     navigate(`/Ordersuccesspage/${currentorder.id}`);
  //   }
  // }, [currentorder, navigate]);  // Watch for the current order to change and navigate

  // if (!products.length) {
  //   return <Navigate to="/" replace={true} />;
  // }


  return (
    <Layout>
      <Protected>
        <ScrollTop />
        <div className="py-4 pt-20 w-full px-10" style={{ backgroundColor: bgcolor }} >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Personal Information - Takes 2/3 of the space on large screens */}
            <div className="lg:col-span-2 order-2 lg:order-1 px-4 py-4 rounded-xl bg-white shadow-md">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-10">
                  {/* Personal Info Header */}
                  <div className="border-b pb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    <p className="mt-2 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* First Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700">First Name</label>
                      <input
                        id="name"
                        {...register('name', { required: true })}
                        type="text"
                        autoComplete="given-name"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                      <input
                        id="email"
                        {...register('email', {
                          required: true,
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        autoComplete="email"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country</label>
                      <div className="relative">
                        <select
                          id="country"
                          {...register('country', { required: true })}
                          className="mt-1 block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2">
                      <label htmlFor="street-address" className="block text-sm font-semibold text-gray-700">Street Address</label>
                      <input
                        id="street-address"
                        {...register('street_address', { required: true })}
                        type="text"
                        autoComplete="street-address"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700">City</label>
                      <input
                        id="city"
                        {...register('city', { required: true })}
                        type="text"
                        autoComplete="address-level2"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* State / Province */}
                    <div>
                      <label htmlFor="region" className="block text-sm font-semibold text-gray-700">State / Province</label>
                      <input
                        id="region"
                        {...register('region', { required: true })}
                        type="text"
                        autoComplete="address-level1"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Zip Code */}
                    <div>
                      <label htmlFor="postal-code" className="block text-sm font-semibold text-gray-700">Postal Code</label>
                      <input
                        id="postal-code"
                        {...register('postal_code', { required: true })}
                        type="text"
                        autoComplete="postal-code"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                  </div>

                  {/* Saved Addresses */}
                  <div className="border-t pt-8">
                    <h2 className="text-lg font-semibold text-gray-800">Saved Addresses</h2>
                    <p className="text-sm text-gray-500 mb-4">Choose from your existing addresses:</p>

                    {Array.isArray(user.address) && user.address.length ? (
                      <ul className="space-y-4">
                        {user.address.map((address, index) => (
                          <li key={index} className="flex justify-between items-center gap-4 p-4 border rounded-lg shadow-sm">
                            <div className="flex gap-3">
                              <input
                                onChange={handleAddress}
                                name="address"
                                type="radio"
                                value={index}
                                className="h-4 w-4 mt-1 text-indigo-600 border-gray-300"
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{address.name}</p>
                                <p className="text-xs text-gray-500">{address.street}</p>
                                <p className="text-xs text-gray-500">ZIP: {address.pinCode}</p>
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{address.country}</p>
                              <p>{address.city}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No addresses available</p>
                    )}
                  </div>

                  {/* Payment Section */}
                  <div className="pt-8 border-t">
                    <fieldset>
                      <legend className="text-lg font-semibold text-gray-800 mb-1">Payment Methods</legend>
                      <p className="text-sm text-gray-500 mb-4">Choose one payment option:</p>
                      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            id="cash"
                            name="payments"
                            type="radio"
                            value="cash"
                            onChange={handlePayment}
                            checked={selectpaymentmode === 'cash'}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Cash</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            id="card"
                            name="payments"
                            type="radio"
                            value="card"
                            onChange={handlePayment}
                            checked={selectpaymentmode === 'card'}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Card Payment</span>
                        </label>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>


            {/* Cart - Takes 1/3 of the space on large screens */}
            <div className="lg:col-span-1 p-2 order-1 lg:order-2 rounded-lg shadow-sm px-4" style={{ backgroundColor: '#FDFAF6' }}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Cart</h2>

              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {products.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="text-sm">
                              <a href={`/product/${item.id}`}>{item.product.title}</a>
                            </h3>
                            <p className="ml-4">${item.product.discountPercentage} % Discount</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{item.product.brand}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            <label
                              htmlFor={`quantity-${item.id}`}
                              className="inline mr-2 text-xs font-medium text-gray-700"
                            >
                              Qty
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              onChange={(e) => handleQuantity(e, item)}
                              value={item.quantity}
                              className="rounded border-gray-300 text-xs py-1"
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>

                          <div className="flex">
                            <button
                              onClick={(e) => handleremove(e, item.id)}
                              type="button"
                              className="font-medium text-primary hover:text-primary/80 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between my-2 text-sm font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>$ {totalAmount}</p>
                </div>
                <div className="flex justify-between my-2 text-sm font-medium text-gray-900">
                  <p>Total Items in Cart</p>
                  <p>{totalItems} items</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={handleOrder}
                    className="w-full bg-green-700 cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-primary/90"
                  >
                    Order Now
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{" "}
                    <Link to="/">
                      <button type="button" className="font-medium text-primary hover:text-primary/80">
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Protected>

    </Layout>
  )
}

export default Checkoutpage
