import { useNavigate } from "react-router-dom";
import useUser from "../features/authentication/useUser.js";
import { useEffect } from "react";
import FullPage from "./FullPage.jsx";
import Spinner from "./Spinner.jsx";

export default function ReversedProtectedRoute({ children }) {
  const navigate = useNavigate();

  // get user from token if there is
  const { isAuthenticated, isLoading } = useUser();

  // 2. If there is NO authenticated user, allow them to visit the auth pages
  useEffect(
    function () {
      if (isAuthenticated && !isLoading) navigate("/app", { replace: true });
    },
    [isAuthenticated, isLoading, navigate, children],
  );

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If there IS a user, don't allow them in auth pages
  if (!isAuthenticated) return children;
}
