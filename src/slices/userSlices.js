import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInformaition: localStorage.getItem("userInfoStore")
      ? JSON.parse(localStorage.getItem("userInfoStore"))
      : null,
  },
  reducers: {
    userLoginInfo: (state, action) => {
      state.userInformaition = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { userLoginInfo } = userSlice.actions;

export default userSlice.reducer;
