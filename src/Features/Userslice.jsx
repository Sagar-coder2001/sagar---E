import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoggedInUser, fetchUserorder, updateUser } from '../Components/Client/User/Userapi';

const initialState = {
  value: '',
  userInfo: {
    orders: [],  // initialize orders as an empty array
  }
}

export const fetchUserOrderToAsync = createAsyncThunk(
  'user/fetchUserorder',
  async (id) => {
    const response = await fetchUserorder(id);
    return response.data;
  }
)

export const fetchLoggedInUserAsync = createAsyncThunk(
    'user/fetchLoggedInUser',
    async (id) => {
      const response = await fetchLoggedInUser(id);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );
  
  export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async (update) => {
      // this is name mistake
      const response = await updateUser(update);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );

export const Userslice = createSlice({
  name: 'user',
  initialState,
  reducers: {
 
  },
  extraReducers: (builder) => { 
    builder
    .addCase(fetchUserOrderToAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchUserOrderToAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userInfo.orders = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        // earlier there was loggedInUser variable in other slice
        state.userInfo = action.payload;
      })
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        // this info can be different or more from logged-in User info
        state.userInfo = action.payload;
      });
  }
})


export const selectUserOrders = (state) => state.user.userInfo.orders;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserInfoStatus = (state) => state.user.status;

export default Userslice.reducer