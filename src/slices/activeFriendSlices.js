import { createSlice } from "@reduxjs/toolkit";

export const activeFriend = createSlice({
  name: "active",
  initialState: {
    activeChat: localStorage.getItem("activeChatUser") ? JSON.parse(localStorage.getItem("activeChatUser")): "null",
  },
  reducers: {
    activeFriends: (state,action) => {
      state.activeChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { activeFriends } = activeFriend.actions;

export default activeFriend.reducer;
