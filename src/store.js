import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlices";
import activeFriendSlices from "./slices/activeFriendSlices";
export default configureStore({
  reducer: {
    userAllInfo: userSlice,
    activeChatFriend: activeFriendSlices,
  },
});
