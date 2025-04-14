import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addOrder, fetchAllOrders, updateOrder } from '../Components/Client/Order/Orderapi';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder: null,
  totalOrders: 0
}

export const addOrderToAsync = createAsyncThunk(
  'order/addOrder',
  async (item) => {
    const response = await addOrder(item);
    return response.data;
  }
)

export const updateOrderAsync = createAsyncThunk(
  'order/updateOrder',
  async (order) => {
    const response = await updateOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchAllOrdersAsync = createAsyncThunk(
  'order/fetchAllOrders',
  async () => {
    try {
      const response = await fetchAllOrders();

      // Return the data to be used in the reducer
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;  // Throw error to be caught by `rejected` case
    }
  }
);


export const Orderslice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    rsetorder:(state) => {
        state.currentOrder = null;
    }
  },
  extraReducers: (builder) => { 
    builder
    .addCase(addOrderToAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addOrderToAsync.fulfilled, (state, action) => {
        state.status = 'idle';
          state.orders.push(action.payload);
          state.currentOrder = action.payload;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index =  state.orders.findIndex(order=>order.id===action.payload.user)
        state.orders[index] = action.payload;
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
      })
  }
})


export const resetorder = Orderslice.actions;

export const Orderplacedstatus = (state) => state.order.currentorder;
export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectStatus = (state) => state.order.status;


export default Orderslice.reducer