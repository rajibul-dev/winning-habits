import { createContext, useContext, useReducer } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";

// axios.defaults.withCredentials = true; // Enable sending cookies
const apiClient = axios.create({ ...apiConfig, withCredentials: true });

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  async function login(email, password) {
    try {
      const res = await apiClient.post("/api/v1/auth/login", {
        email,
        password,
      });
      dispatch({ type: "login", payload: res.data });
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      await apiClient.get("/api/v1/auth/logout");
      dispatch({ type: "logout" });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
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
