import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as apiLogin } from "../../api/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending: isLogining,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => apiLogin({ email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/app", { replace: true });
      toast.success(`Logged in successfully! Welcome ${data.user.name}!`);
    },
  });

  return { login, isLogining, error };
}
