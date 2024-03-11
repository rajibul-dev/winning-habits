import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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