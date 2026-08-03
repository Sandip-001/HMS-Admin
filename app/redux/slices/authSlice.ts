import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  fetchCurrentUser,
} from "../thunks/authThunks";

interface AuthState {
  user: any;
  loading: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Login

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })

      // Logout

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // Current User

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
      });
  },
});

export default authSlice.reducer;