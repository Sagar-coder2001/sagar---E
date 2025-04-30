
import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Layout from '../../Components/Client/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { deleteItemAsync, fechItemByProductIdAsync, selectCartItems, updateItemAsync } from '../../Features/Cartslice'
import ScrollTop from '../../Components/Client/Common/Scolltop'
import { selectLoggedInUser } from '../../Features/Authslice'

export default function Cartpage() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate();
  const products = useSelector(selectCartItems);
  const user = useSelector(selectLoggedInUser)
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)
  // const products = useSelector((state) => state.product.data)
  const dispatch = useDispatch();
  const totalAmount = products.reduce((amount, item) => item.product.price * item.quantity + amount, 0);
  const totalItems = products.reduce((total, item) => item.quantity + total, 0);


  const handleQuantity = (e, item) => {
    dispatch(updateItemAsync({ id: item.id, quantity: +e.target.value }))
      .then(() => {
        dispatch(fechItemByProductIdAsync(user.id)); // assuming you have the user ID
      });
  };


  const handleremove = (e, item) => {
    dispatch(deleteItemAsync(item.id));
  }

  return (
    <Layout>
      <ScrollTop />
      <Dialog open={open} onClose={() => navigate('/')} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden mt-10 ">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll shadow-xl"style={{ backgroundColor: bgcolor, color: txtcolor }} >
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium">Shopping cart</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => navigate('/')}
                          className="relative -m-2 p-2 "
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">

                          {products.map((product, index) => (

                            <li key={product.id} className="flex py-6">
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                {product?.product?.images?.[0] && (
                                  <img src={product.product.images[0]} className="size-full object-cover" />
                                )}
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium">
                                    <h3>
                                      <a>{product.product.title}</a>
                                    </h3>
                                    <p className="ml-4">{product.product.price}</p>
                                  </div>
                                  {/* <p className="mt-1 text-sm text-gray-500">{product.rating.rate}</p> */}
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <p>Qty </p>
                                  <select value={product.quantity} onChange={(e) => handleQuantity(e, product)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>

                                  </select>

                                  <div className="flex">
                                    <button type="button"
                                      onClick={(e) => handleremove(e, product)}
                                      className="font-medium text-indigo-600 hover:text-indigo-500">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium">
                      <p>Subtotal</p>
                      <p>{totalAmount.toFixed(2)}</p>
                      <p>Total Items</p>
                      <p>{totalItems}</p>
                    </div>
                    <p className="mt-0.5 text-sm">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <Link
                        to={'/Checkoutpage'}
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium  shadow-xs hover:bg-indigo-700"
                      >
                        Checkout
                      </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm">
                      <p>
                        <Link to={'/'}>
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </Layout>

  )
}
