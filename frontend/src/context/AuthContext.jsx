import { createContext, useContext, useReducer } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";

const apiClient = axios.create({ ...apiConfig, withCredentials: true });

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  message: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "register":
      return { ...state, message: action.payload };
    case "verify-email":
      return {
        ...state,
        message: action.payload.msg,
        user: action.payload.user,
      };
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        message: action.payload,
      };
    case "request-new-verification-email":
      return { ...state, message: action.payload };
    case "forgot-password":
      return { ...state, message: action.payload };
    case "reset-password":
      return { ...state, message: action.payload };
    case "change-password":
      return { ...state, message: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  async function register({ name, email, password }) {
    const res = await apiClient.post("/api/v1/auth/register", {
      name,
      email,
      password,
    });
    dispatch({ type: "register", payload: res.data.msg });
  }

  async function verifyEmail({ verificationToken, email }) {
    const res = await apiClient.post("/api/v1/auth/verify-email", {
      email,
      verificationToken,
    });
    dispatch({ type: "verify-email", payload: res.data.msg });
  }

  async function login({ email, password }) {
    const res = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    dispatch({ type: "login", payload: res.data });
  }

  async function logout() {
    const res = await apiClient.get("/api/v1/auth/logout");
    dispatch({ type: "logout", payload: res.data.msg });
  }

  async function requestNewVerificationEmail(email) {
    const res = await apiClient.post(
      "/api/v1/auth/request-new-verification-email",
      { email },
    );
    dispatch({ type: "request-new-verification-email", payload: res.data.msg });
  }

  async function forgotPassword(email) {
    const res = await apiClient.post("/api/v1/auth/forgot-password", {
      email,
    });
    dispatch({ type: "forgot-password", payload: res.data.msg });
  }

  async function resetPassword({ email, token, password }) {
    const res = await apiClient.post("/api/v1/auth/reset-password", {
      email,
      token,
      password,
    });
    dispatch({ type: "reset-password", payload: res.data.msg });
  }

  async function changePassword({ currentPassword, newPassword }) {
    const res = await apiClient.post("/api/v1/auth/change-password", {
      currentPassword,
      newPassword,
    });
    dispatch({ type: "change-password", payload: res.data.msg });
  }

  return (
    <AuthContext.Provider
      value={{
        register,
        verifyEmail,
        login,
        logout,
        requestNewVerificationEmail,
        forgotPassword,
        resetPassword,
        changePassword,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
