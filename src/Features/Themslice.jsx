import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial theme from localStorage, or use default
const storedTheme = localStorage.getItem('theme') || 'white';
const initialState = storedTheme === 'white' ? {
  value: 'white',
  navbar: '#D4E7C5',
  textcolor: 'black'
} : {
  value: '#0E1027',
  navbar: '#1D1616',
  textcolor: 'white'
};

export const Themeslice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    white: (state) => {
      state.value = 'white';
      state.navbar = '#D4E7C5';
      state.textcolor = 'black';
      localStorage.setItem('theme', 'white'); // Store in localStorage
    },
    dark: (state) => {
      state.value = '#0E1027';
      state.navbar = '#1D1616';
      state.textcolor = 'white';
      localStorage.setItem('theme', 'dark'); // Store in localStorage
    },
  },
});

export const { white, dark } = Themeslice.actions;
export default Themeslice.reducer;