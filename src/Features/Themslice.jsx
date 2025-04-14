import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial theme from localStorage, or use default
const storedTheme = localStorage.getItem('theme') || 'white';
const initialState = storedTheme === 'white' ? {
  value: 'white',
  navbar: '#a9f0da',
  textcolor: 'black'
} : {
  value: '#0E1027',
  navbar: 'black',
  textcolor: 'white'
};

export const Themeslice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    white: (state) => {
      state.value = 'white';
      state.navbar = '#a9f0da';
      state.textcolor = 'black';
      localStorage.setItem('theme', 'white'); // Store in localStorage
    },
    dark: (state) => {
      state.value = '#0E1027';
      state.navbar = 'black';
      state.textcolor = 'white';
      localStorage.setItem('theme', 'dark'); // Store in localStorage
    },
  },
});

export const { white, dark } = Themeslice.actions;
export default Themeslice.reducer;