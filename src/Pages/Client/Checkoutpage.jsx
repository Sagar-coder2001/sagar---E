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
import {loadStripe} from '@stripe/stripe-js';

const Checkoutpage = () => {
  const navigate = useNavigate();
  const products = useSelector(selectCartItems);
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
        <ScrollTop/>
      <div className="container mx-auto py-4 mt-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Personal Information - Takes 2/3 of the space on large screens */}
          <div className="lg:col-span-2 order-2 lg:order-1 px-4 py-2 rounded-md p-2 bg-blue-50">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-8">
                <div className="border-b border-gray-900/10 pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 font-bold">Personal Information</h2>
                  <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>

                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          id="name"
                          {...register('name', { required: true })}
                          type="text"
                          autoComplete="given-name"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          {
                          ...register('email', {
                            required: true,
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Updated regex for email validation
                              message: 'Invalid email address' // Optional: Custom error message
                            }
                          })
                          }
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-900">
                        Country
                      </label>
                      <div className="mt-2 relative">
                        <select
                          id="country"
                          {...register('country', { required: true })}
                          autoComplete="country-name"
                          className="block w-full appearance-none rounded-md bg-white py-1.5 px-3 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="street-address" className="block text-sm font-medium text-gray-900">
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          id="street-address"
                          {
                          ...register('street_address', { required: true })
                          }
                          type="text"
                          autoComplete="street-address"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-900">
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          id="city"
                          {
                          ...register('city', { required: true })
                          }
                          type="text"
                          autoComplete="address-level2"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="region" className="block text-sm font-medium text-gray-900">
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          id="region"
                          {
                          ...register('region', { required: true })
                          }
                          type="text"
                          autoComplete="address-level1"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="postal-code" className="block text-sm font-medium text-gray-900">
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          id="postal-code"
                          {
                          ...register('postal_code', { required: true })
                          }
                          type="text"
                          autoComplete="postal-code"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="cursor-pointer rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-danger shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-emerald-700 px-3 py-2 text-sm-black font-semibold text-danger shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Save
                </button>
              </div>

                <div className="border-b border-gray-900/10 pb-8">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Addresses
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Choose from Existing addresses
                    </p>
                    <ul>
                      {Array.isArray(user.address) && user.address.length ? (
                        user.address.map((address, index) => (
                          <li
                            key={index}
                            className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                          >
                            <div className="flex gap-x-4">
                              <input
                                onChange={handleAddress}
                                name="address"
                                type="radio"
                                value={index}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  {address.name}
                                </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                  {address.street}
                                </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                  {address.pinCode}
                                </p>
                              </div>
                            </div>
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                              <p className="text-sm leading-6 text-gray-900">
                                Phone: {address.country}
                              </p>
                              <p className="text-sm leading-6 text-gray-500">
                                {address.city}
                              </p>
                            </div>
                          </li>
                        ))) : (
                        <p>No addresses available</p>  // Optional: Display fallback message when no addresses exist
                      )}
                    </ul>
                  </div>
                  

                  <div className="mt-6 space-y-6">
                    <div className="mt-10 space-y-10">
                      <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">
                          Payment Methods
                        </legend>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          Choose One
                        </p>
                        <div className="mt-6 space-y-6">
                          <div className="flex items-center gap-x-3">
                            <input
                              id="cash"
                              name="payments"
                              onChange={handlePayment}
                              value="cash"
                              type="radio"
                              checked={selectpaymentmode === 'cash'}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label
                              htmlFor="cash"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Cash
                            </label>
                          </div>
                          <div className="flex items-center gap-x-3">
                            <input
                              id="card"
                              onChange={handlePayment}
                              name="payments"
                              checked={selectpaymentmode === 'card'}
                              value="card"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label
                              htmlFor="card"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Card Payment
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    </div>


                  </div>
                </div>
              </div>

        
            </form>
          </div>

          {/* Cart - Takes 1/3 of the space on large screens */}
          <div className="lg:col-span-1 p-2 order-1 lg:order-2 rounded-lg shadow-sm px-4" style={{backgroundColor:'#FDFAF6'}}>
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
