import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetorder } from '../../Features/Orderslice'
import { selectLoggedInUser } from '../../Features/Authslice'
import Layout from '../../Components/Client/Layout/Layout'
import { useParams } from 'react-router-dom'
import { resetCartAsync } from '../../Features/Cartslice'
import Protected from './Protected'
import ScrollTop from '../../Components/Client/Common/Scolltop'

const Ordersuccesspage = () => {
    const bgcolor = useSelector((state) => state.theme.value)
    const txtcolor = useSelector((state) => state.theme.textcolor)

  const {id} = useParams() 
  // const user = useSelector(selectLoggedInUser)
  // const dispatch = useDispatch();
  
  // useEffect(()=>{
  //  // reset cart
  //  dispatch(resetCartAsync(user.id))
  //  // reset currentOrder
  //  dispatch(resetorder(user.id))
  // },[dispatch])

  return (
   <Layout>
    <Protected>
      <ScrollTop/>
         <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 mt-10" style={{ backgroundColor: bgcolor, color: txtcolor }}>
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">200</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Order Placed
            </h1>
            <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Order succesfully Placed
              <span>{id}</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back home
              </a>
            </div>
          </div>
        </main>
    </Protected>

       </Layout>
  )
}

export default Ordersuccesspage
