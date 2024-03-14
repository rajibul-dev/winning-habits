import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail as apiVerifyEmail } from "../../api/apiAuth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCallback } from "react";

export default function useVerifyEmail() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending: isVerifying } = useMutation({
    mutationFn: ({ verificationToken, email }) =>
      apiVerifyEmail({ verificationToken, email }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/app", { replace: true });
      toast.success(`Email verified! Registration successful!`);
    },
    onError: (error) => {
      console.error(error);
      if (error.response.status === 400) {
        navigate("/login", { replace: true });
        toast.success(`${error.response.data.msg}`);
      } else {
        navigate("/register", { replace: true });
        toast.error(`${error.response.data.msg}`);
      }
    },
  });

  const verifyEmail = useCallback(mutate, [mutate]);

  return { verifyEmail, isVerifying };
}
