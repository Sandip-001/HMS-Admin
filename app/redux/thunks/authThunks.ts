import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",

  async (
    data: LoginPayload,
    { rejectWithValue }
  ) => {
    const user = authService.login(
      data.email,
      data.password
    );

    if (!user) {
      return rejectWithValue("Invalid email or password");
    }

    return user;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",

  async () => {
    authService.logout();
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/current",

  async () => {
    return authService.getCurrentUser();
  }
);