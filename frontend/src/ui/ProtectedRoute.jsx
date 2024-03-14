import { useNavigate } from "react-router-dom";
import useUser from "../features/authentication/useUser.js";
import { useEffect } from "react";
import FullPage from "./FullPage.jsx";
import Spinner from "./Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // get user from token if there is
  const { isAuthenticated, isLoading } = useUser();

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login", { replace: true });
    },
    [isAuthenticated, isLoading, navigate],
  );

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children;
}
