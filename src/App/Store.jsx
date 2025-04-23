import { configureStore } from '@reduxjs/toolkit'
import  Productslice  from '../Features/Productslice'
import  Authslice  from '../Features/Authslice'
import  CartSlice  from '../Features/Cartslice'
import  Orderslice  from '../Features/Orderslice'
import  Userslice  from '../Features/Userslice'
import  Themeslice  from '../Features/Themslice'


export const store = configureStore({
  reducer: {
    product: Productslice,
    auth: Authslice,
    cart:CartSlice,
    order:Orderslice,
    user:Userslice,
    theme:Themeslice
  },
})