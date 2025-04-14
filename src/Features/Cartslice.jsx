import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addToCart, deleteCart, fetchItemsById, resetCart, updateCart } from '../Components/Client/Cart/Cartapi';

const initialState = {
  value: '',
  items : [],
  cartstatus: '',
}

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (item) => {
    const response = await addToCart(item);
    return response.data;
  }
)

export const fechItemByProductIdAsync = createAsyncThunk(
    'cart/fetchItemsById',
    async (id) => {
      const response = await fetchItemsById(id);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );

  export const updateItemAsync = createAsyncThunk(
    'cart/updateCart',
    async (item) => {
      const response = await updateCart(item);
      return response.data;
    }
  )

  export const deleteItemAsync = createAsyncThunk(
    'cart/deleteCart',
    async (id) => {
      const response = await deleteCart(id);
      return response.data;
    }
  )

  export const resetCartAsync = createAsyncThunk(
    'cart/resetCart',
    async (id) => {
      const response = await resetCart(id);
      return response.data;
    }
  )
  
export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => { 
    builder
    .addCase(addToCartAsync.pending, (state) => {
      state.cartstatus = 'loading';
    })
    .addCase(addToCartAsync.fulfilled, (state, action) => {
          state.cartstatus = 'idle';
          state.items.push(action.payload);
      })
    .addCase(fechItemByProductIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fechItemByProductIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(updateItemAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateItemAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      
        // Find the index of the item that needs to be updated
        const index = state.items.findIndex((item) => item?.id === action.payload.id);
      
        if (index !== -1) {
          // Update the item directly in the state array (Immer handles immutability for you)
          state.items[index] = action.payload;
        } else {
          console.error('Item not found in the cart');
        }
      })
      
      
      .addCase(deleteItemAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        state.items.splice(index ,1);
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetCartAsync.fulfilled, (state, action) => {
          state.status = 'idle';
            state.items = (action.payload);
        })
  }
})

export const selectCartItems = (state) => state.cart.items;
export const cartstatus = (state) => state.cart.cartstatus;



export default CartSlice.reducer