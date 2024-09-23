import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalStyles from "./styles/GlobalStyles.js";

import Spinner from "./ui/Spinner.jsx";
import FullPage from "./ui/FullPage.jsx";
import { Toaster } from "react-hot-toast";

import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Root from "./pages/Root";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import ReversedProtectedRoute from "./ui/ReversedProtectedRoute.jsx";
import AppLayout from "./ui/AppLayout";
import Habits from "./pages/Habits";
import SingleHabit from "./pages/SingleHabit";
import Achievements from "./pages/Achievements";
import Archive from "./pages/Archive";
import Users from "./pages/Users.jsx";
import Profile from "./pages/Profile";
import { DarkModeProvider } from "./context/DarkModeContext";
import { toastNotifierIndex } from "./styles/zIndexManager.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export default function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools
          position="bottom"
          buttonPosition="bottom-left"
          initialIsOpen={false}
        />
        <GlobalStyles />
        <BrowserRouter>
          <Suspense
            fallback={
              <FullPage>
                <Spinner />
              </FullPage>
            }
          >
            <Routes>
              <Route path="/" element={<Root />} />
              <Route
                path="/login"
                element={
                  <ReversedProtectedRoute>
                    <Login />
                  </ReversedProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ReversedProtectedRoute>
                    <Register />
                  </ReversedProtectedRoute>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <ReversedProtectedRoute>
                    <VerifyEmail />
                  </ReversedProtectedRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <ReversedProtectedRoute>
                    <ForgotPassword />
                  </ReversedProtectedRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <ReversedProtectedRoute>
                    <ResetPassword />
                  </ReversedProtectedRoute>
                }
              />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="habits" />} />
                <Route path="habits" element={<Habits />} />
                <Route path="habits/:habitID" element={<SingleHabit />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="archive" element={<Archive />} />
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{
            margin: "8px",
          }}
          toastOptions={{
            success: {
              duration: 4000,
            },
            error: {
              duration: 10000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
              zIndex: toastNotifierIndex,
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}
