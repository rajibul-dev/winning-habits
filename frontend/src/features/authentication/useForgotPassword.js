import { useMutation } from "@tanstack/react-query";
import { forgotPassword as apiForgotPassword } from "../../api/apiAuth.js";

export default function useForgotPassword() {
  const {
    mutate: onForgotPassword,
    isSuccess,
    isPending: pendingForgotPassword,
    error,
  } = useMutation({
    mutationFn: (email) => apiForgotPassword(email),
  });

  return { onForgotPassword, isSuccess, pendingForgotPassword, error };
}
