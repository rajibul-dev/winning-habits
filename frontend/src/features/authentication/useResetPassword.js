import { useMutation } from "@tanstack/react-query";
import { resetPassword as apiResetPassword } from "../../api/apiAuth.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useResetPassword() {
  const navigate = useNavigate();
  const {
    mutate: resetPassword,
    isPending: isResetting,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ email, token, password }) =>
      apiResetPassword({ email, token, password }),
  });

  return { resetPassword, isResetting, isSuccess, error };
}
