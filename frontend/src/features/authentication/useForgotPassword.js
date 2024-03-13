import { useMutation } from "@tanstack/react-query";
import { forgotPassword as apiForgotPassword } from "../../api/apiAuth.js";

export default function useForgotPassword() {
  const {
    mutate: onForgotPassword,
    status,
    isPending: pendingForgotPassword,
    error,
  } = useMutation({
    mutationFn: (email) => apiForgotPassword(email),
  });

  return { onForgotPassword, status, pendingForgotPassword, error };
}
