import React, { useEffect } from 'react'
import Layout from '../../Components/Client/Layout/Layout'
import Adminsidebar from './Adminsidebar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersAsync, selectOrders } from '../../Features/Orderslice'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ScrollTop from '../../Components/Client/Common/Scolltop'

const Admindashboardpage = () => {
    const orders = useSelector(selectOrders)
    const dispatch = useDispatch();
    const bgcolor = useSelector((state) => state.theme.value)
    const txtcolor = useSelector((state) => state.theme.textcolor)

    useEffect(() => {
        dispatch(fetchAllOrdersAsync());
    }, [dispatch]);

    // Prepare data for the chart (e.g., totalAmount per order)
    const chartData = orders.map((order, index) => ({
        name: `Order ${index + 1}`,  // Or any other identifier (e.g., date)
        totalAmount: order.totalAmount,
    }));

    return (
        <div>
            <Layout>
                <Adminsidebar />
                <ScrollTop/>
                <div className="overflow-x-auto sm:ml-64 py-6 mt-10 " style={{ backgroundColor: bgcolor, color: txtcolor }}>
                    <div className="mt-4">
                        <div className="grid px-2">
                            <h2 className='text-3xl mx-2 mb-4' >Dasboard</h2>
                            <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 mb-4">
                                <div className="bg-amber-200 p-2 text-white text-2xl text-bold text-center p-5 rounded-2xl">
                                    <p>Orders</p>
                                    <p>{orders.length}</p>
                                </div>
                                <div className="bg-blue-200 p-2 text-white text-2xl text-bold text-center p-5 rounded-2xl">
                                    <p>Products</p>
                                    <p>0</p>
                                </div>
                                <div className="bg-cyan-200 p-2 text-white text-2xl text-bold text-center p-5 rounded-2xl">
                                    <p>Users</p>
                                    <p>0</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="mt-5 h-screen px-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Admindashboardpage;
