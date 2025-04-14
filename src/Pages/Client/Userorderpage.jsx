import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserOrderToAsync, selectUserOrders } from '../../Features/Userslice';
import Layout from '../../Components/Client/Layout/Layout';
import Protected from './Protected';
import ScrollTop from '../../Components/Client/Common/Scolltop';


const Userorderpage = () => {
  const product = useSelector(selectUserOrders);


  const handleremove = (e, item) => {  
    e.preventDefault();
    // dispatch(deleteItemAsync(item.id));
  }


  if (!product || !product[0]) {
    return (
      <Layout>
        <Protected>
          <ScrollTop/>
          <div className="lg:col-span-1 order-1 lg:order-2 bg-white rounded-lg p-6 shadow-sm mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">My Orders</h2>
            <p>No orders available</p> {/* Display this if no product exists */}
          </div>
        </Protected>
      </Layout>
    );
  }

  return (
    <Layout>
      <Protected>

        <div className="lg:col-span-1 order-1 lg:order-2 bg-white rounded-lg p-6 shadow-sm mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">My Orders</h2>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              <div className="space-y-4">
                {/* Status Section */}
                <div className="flex items-center justify-between mt-2 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold text-gray-900">Status</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {product[0].status}
                  </span>
                </div>

                {/* Created At Section */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold text-gray-900">Created At</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {product[0].createdAt}
                  </span>
                </div>
              </div>

              {product[0].products.map((item) => (
                <li key={item.product.id} className="flex py-6">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>


                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="text-sm">
                          <a href={`/product/${item.id}`}>{item.product.title}</a>
                        </h3>
                        <p className="ml-4">${item.product.discountPercentage}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{'item.brand'}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="text-gray-500">
                        <label
                          htmlFor={`quantity-${item.id}`}
                          className="inline mr-2 text-xs font-medium text-gray-700"
                        >
                          Qty : {item.quantity}
                        </label>

                      </div>

                      <div className="flex">
                        <button
                          onClick={(e) => handleremove(e, item)}
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
            <p className="mt-0.5 text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>

          </div>
        </div>

      </Protected>

    </Layout>

  )
}

export default Userorderpage
