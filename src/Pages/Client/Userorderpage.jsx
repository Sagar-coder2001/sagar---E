import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrderToAsync, selectUserOrders } from '../../Features/Userslice';
import Layout from '../../Components/Client/Layout/Layout';
import Protected from './Protected';
import ScrollTop from '../../Components/Client/Common/Scolltop';

const Userorderpage = () => {
  const product = useSelector(selectUserOrders);
    const bgcolor = useSelector((state) => state.theme.value)
    const txtcolor = useSelector((state) => state.theme.textcolor)

  const handleremove = (e, item) => {
    e.preventDefault();
    // dispatch(deleteItemAsync(item.id));
  };

  if (!product || !product[0]) {
    return (
      <Layout>
        <Protected>
          <ScrollTop />
          <div className="mt-10 bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">My Orders</h2>
            <p className="text-center text-gray-500">No orders available</p>
          </div>
        </Protected>
      </Layout>
    );
  }

  return (
    <Layout>
      <Protected>
        <ScrollTop />
        <div className="max-w-full mx-auto pt-20 pb-5 rounded-lg p-6 shadow-md " style={{ backgroundColor: bgcolor, color: txtcolor }}>
          <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg border text-sm sm:text-base">
              <span className="font-semibold">Status:</span>
              <span>{product[0].status}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg border text-sm sm:text-base">
              <span className="font-semibold">Created At:</span>
              <span >
                {new Date(product[0].createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <ul className="divide-y divide-gray-200 mt-6">
            {product[0].products.map((item) => (
              <li key={item.product.id} className="flex flex-col sm:flex-row gap-4 py-6">
                <div className="flex-shrink-0 w-full sm:w-24 overflow-hidden rounded-md border">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-sm font-semibold">
                      <h3>
                        <a href={`/product/${item.product.id}`} className="hover:underline">
                          {item.product.title}
                        </a>
                      </h3>
                      <p>${item.product.discountPercentage}</p>
                    </div>
                    <p className="mt-1 text-xs">{item.product.brand}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-3">
                    <p className="text-xs">Qty: {item.quantity}</p>
                    <button
                      onClick={(e) => handleremove(e, item)}
                      className="text-primary hover:text-primary/80 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-xs text-center">
              Shipping and taxes calculated at checkout.
            </p>
          </div>
        </div>
      </Protected>
    </Layout>
  );
};

export default Userorderpage;
