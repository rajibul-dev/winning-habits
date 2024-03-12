import { useMutation } from "@tanstack/react-query";
import { resetPassword as apiResetPassword } from "../../api/apiAuth.js";

export default function useResetPassword() {
  const {
    mutate: resetPassword,
    isPending: isResetting,
    status,
  } = useMutation({
    mutationFn: ({ email, token, password }) =>
      apiResetPassword({ email, token, password }),
  });

  return { resetPassword, isResetting, status };
}
