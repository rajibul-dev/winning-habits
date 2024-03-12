import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalStyles from "./styles/GlobalStyles.js";

import Spinner from "./ui/Spinner.jsx";
import FullPage from "./ui/FullPage.jsx";

import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
const Root = lazy(() => import("./pages/root"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AppLayout = lazy(() => import("./ui/AppLayout"));
const Habits = lazy(() => import("./pages/Habits"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Archive = lazy(() => import("./pages/Archive"));
const SingleHabit = lazy(() => import("./pages/SingleHabit"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export default function App() {
  return (
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element=<Navigate to="habits" /> />
              <Route path="habits" element={<Habits />} />
              <Route path="habits/:id" element={<SingleHabit />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="archive" element={<Archive />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
