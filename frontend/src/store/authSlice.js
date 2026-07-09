import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/client.js";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials) => (await api.post("/auth/login", credentials)).data.data,
);
export const register = createAsyncThunk(
  "auth/register",
  async (details) => (await api.post("/auth/register", details)).data.data,
);
export const restoreSession = createAsyncThunk(
  "auth/restore",
  async () => (await api.get("/auth/me")).data.data,
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: sessionStorage.getItem("accessToken"),
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        sessionStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        sessionStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        sessionStorage.removeItem("accessToken");
      }),
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
