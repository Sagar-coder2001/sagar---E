"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { EyeIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"
import { fetchAllOrdersAsync, selectOrders, updateOrderAsync } from "../../Features/Orderslice"
import ProtectedAdmin from "./ProtectedAdmin"
import Layout from "../../Components/Client/Layout/Layout"
import Adminsidebar from "./Adminsidebar"
import ScrollTop from "../../Components/Client/Common/Scolltop"

function AdminOrders() {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sort, setSort] = useState({ _sort: "id", _order: "desc" })
    const bgcolor = useSelector((state) => state.theme.value)
    const txtcolor = useSelector((state) => state.theme.textcolor)

  useEffect(() => {
    dispatch(fetchAllOrdersAsync())
  }, [dispatch])

  const handleSort = (sortOption) => {
    setSort(sortOption)
    // Implement sorting logic here if needed
  }

  const handleShowDetails = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleOrderStatus = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value }
    dispatch(updateOrderAsync(updatedOrder))
  }

  const handleOrderPaymentStatus = (e, order) => {
    const updatedOrder = { ...order, paymentStatus: e.target.value }
    dispatch(updateOrderAsync(updatedOrder))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-100 text-purple-800"
      case "dispatched":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "received":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout>
      <ProtectedAdmin>
        <Adminsidebar />
        <ScrollTop />

        <div className="p-4 sm:ml-64 pt-20" style={{backgroundColor : bgcolor , color : txtcolor}}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold" >Order Management</h1>
              </div>

              <div className="rounded-lg shadow overflow-hidden" >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th
                          className="px-4 py-3 cursor-pointer"
                          onClick={() => handleSort({ _sort: "id", _order: sort._order === "asc" ? "desc" : "asc" })}
                        >
                          <div className="flex items-center">
                            Order #
                            {sort._sort === "id" &&
                              (sort._order === "asc" ? (
                                <ArrowUpIcon className="w-4 h-4 ml-1" />
                              ) : (
                                <ArrowDownIcon className="w-4 h-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-4 py-3 hidden md:table-cell">Customer</th>
                        <th className="px-4 py-3">Status</th>
                        <th
                          className="px-4 py-3 cursor-pointer"
                          onClick={() =>
                            handleSort({ _sort: "totalAmount", _order: sort._order === "asc" ? "desc" : "asc" })
                          }
                        >
                          <div className="flex items-center">
                            Total
                            {sort._sort === "totalAmount" &&
                              (sort._order === "asc" ? (
                                <ArrowUpIcon className="w-4 h-4 ml-1" />
                              ) : (
                                <ArrowDownIcon className="w-4 h-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => handleShowDetails(order)}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                              <div className="text-xs text-gray-500 hidden sm:block">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm font-medium text-gray-900">{order.selectaddress.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">${order.totalAmount}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <button
                                className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleShowDetails(order)
                                }}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Modal */}
        {isModalOpen && selectedOrder && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={() => setIsModalOpen(false)}
              ></div>

              {/* Modal panel */}
           
            <div className="inline-block align-bottom  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4" style={{backgroundColor : bgcolor , color : txtcolor}}>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="text-lg leading-6 font-medium " id="modal-title">
                      Order #{selectedOrder.id}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium ">Customer Information</h3>
                        <div className="mt-2  p-3 rounded-md">
                          <p className="text-sm font-medium">{selectedOrder.selectaddress.name}</p>
                          <p className="text-sm">{selectedOrder.selectaddress.street_address}</p>
                          <p className="text-sm">
                            {selectedOrder.selectaddress.city}, {selectedOrder.selectaddress.region},{" "}
                            {selectedOrder.selectaddress.postal_code}
                          </p>
                          <p className="text-sm ">{selectedOrder.selectaddress.country}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium ">Payment Information</h3>
                        <div className="mt-2p-3 rounded-md">
                          <div className="flex justify-between">
                            <p className="text-sm">Method:</p>
                            <p className="text-sm font-medium">{selectedOrder.selectpaymentmode}</p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm">Status:</p>
                            <div>
                              <select
                              style={{backgroundColor : bgcolor , color : txtcolor}}
                                className="h-7 px-2 py-0 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                defaultValue={selectedOrder.paymentStatus}
                                onChange={(e) => handleOrderPaymentStatus(e, selectedOrder)}
                              >
                                <option value="pending">Pending</option>
                                <option value="received">Received</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm ">Total:</p>
                            <p className="text-sm font-medium">${selectedOrder.totalAmount}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium ">Order Status</h3>
                        <div className="mt-2">
                          <select
                            style={{backgroundColor : bgcolor , color : txtcolor}}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            defaultValue={selectedOrder.status}
                            onChange={(e) => handleOrderStatus(e, selectedOrder)}
                          >
                            <option value="pending">Pending</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium ">Order Items</h3>
                      <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {selectedOrder.products.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 bg-gray-50 p-2 rounded-md">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                              <img
                                src={item.product.images[0] || "/placeholder.svg"}
                                alt={item.product.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex-shrink-0 text-sm font-medium text-gray-900">${item.product.price}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <h3 className="text-sm font-medium ">Timeline</h3>
                        <div className="mt-2 p-3 rounded-md space-y-2">
                          <div className="flex justify-between">
                            <p className="text-xs ">Created:</p>
                            <p className="text-xs">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-xs ">Last Updated:</p>
                            <p className="text-xs">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="cursor-pointer mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
                </div>
              
              </div>
            </div>
          </div>
        )}
      </ProtectedAdmin>
    </Layout>
  )
}

export default AdminOrders
