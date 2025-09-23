import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: '',
    city: '',
    state: '',
    address: '',
    shopsInMyCity: null,
    itemsInMyCity: null,
    cartItems: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
  },
});

export const {
  setUserData,
  setCity,
  setState,
  setAddress,
  setShopsInMyCity,
  setItemsInMyCity,
} = userSlice.actions;
export default userSlice.reducer;
