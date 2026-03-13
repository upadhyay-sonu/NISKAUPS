import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" ? token : null;
};

const initialState = {
  user: getInitialUser(),
  token: getInitialToken(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Register
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Login
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Initialize auth state from localStorage (called on app load)
    initializeAuth: (state) => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user && token) {
        try {
          state.user = JSON.parse(user);
          state.token = token;
        } catch (error) {
          // If JSON parsing fails, clear invalid data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          state.user = null;
          state.token = null;
        }
      }
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
